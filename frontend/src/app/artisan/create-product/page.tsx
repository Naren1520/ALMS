'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { enqueue } from '@/lib/syncQueue';

/** Zero-effort product creation (Req 4.1–4.8) */
export default function CreateProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const voiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MAX_IMAGES = 10;
  const MAX_SIZE = 20 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const errors: string[] = [];

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Only JPEG, PNG, WebP allowed`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: Exceeds 20 MB limit`);
        continue;
      }
    }

    if (images.length + files.filter((_, i) => !errors[i]).length > MAX_IMAGES) {
      errors.push(`Maximum ${MAX_IMAGES} images per product`);
    }

    setImageErrors(errors);
    if (errors.length === 0) {
      setImages((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setVoiceFile(new File([blob], 'voice.webm', { type: 'audio/webm' }));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRef.current = recorder;
      setRecording(true);

      // Auto-stop at 5 minutes (Req 4.3)
      voiceTimerRef.current = setTimeout(() => {
        stopRecording();
        alert('Voice recording stopped at 5-minute maximum duration.');
      }, 5 * 60 * 1000);
    } catch {
      alert('Could not access microphone. Please check permissions.');
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
    if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
    setRecording(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) return;
    setSubmitting(true);

    // If offline, save to sync queue (Req 4.8)
    if (!navigator.onLine) {
      enqueue(
        'PRODUCT_DRAFT',
        { textInput, imageCount: images.length },
        (evicted) => alert(`Oldest pending item removed to make room: ${evicted.id}`),
      );
      setJobStatus('Saved offline. Will sync when you reconnect.');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append('images', img));
      if (voiceFile) formData.append('voice', voiceFile);
      if (textInput) formData.append('textInput', textInput);

      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/v1/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token ?? ''}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Submission failed');

      setJobStatus(`Processing started. Job ID: ${data.jobId}`);
      router.push(`/artisan/products/${data.productId}/progress?jobId=${data.jobId}`);
    } catch (err: unknown) {
      setJobStatus(`Error: ${err instanceof Error ? err.message : 'Submission failed'}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen py-12 px-4" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-light mb-2">List a Product</h1>
        <p className="font-ui text-brand-muted mb-8">
          Just upload a photo. Optionally record a voice note or type a description.
          Our AI handles the rest.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image upload — single screen, required */}
          <div>
            <label
              htmlFor="product-images"
              className="block text-sm font-ui font-medium text-brand-text mb-2"
            >
              Product photos <span aria-hidden="true">*</span>
            </label>
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-brand-accent transition-colors"
              style={{ borderColor: '#D1C4B0' }}
              onClick={() => document.getElementById('product-images')?.click()}
              role="button"
              tabIndex={0}
              aria-label="Click to upload product images"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('product-images')?.click(); }}
            >
              <input
                id="product-images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={handleImageChange}
                aria-describedby="image-help image-errors"
              />
              <p className="font-ui text-brand-muted" id="image-help">
                JPEG, PNG, or WebP — up to {MAX_IMAGES} images, max 20 MB each
              </p>
              {images.length > 0 && (
                <p className="mt-2 font-ui text-brand-accent font-medium">
                  {images.length} image{images.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            {imageErrors.length > 0 && (
              <ul id="image-errors" className="mt-2 space-y-1" role="alert">
                {imageErrors.map((err, i) => (
                  <li key={i} className="text-sm text-red-600 font-ui">{err}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Voice recording — optional */}
          <div>
            <p className="text-sm font-ui font-medium text-brand-text mb-2">
              Voice description{' '}
              <span className="text-brand-muted font-normal">(optional)</span>
            </p>
            <div className="flex items-center gap-4">
              {!recording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border font-ui text-sm hover:border-brand-accent transition-colors"
                  style={{ borderColor: '#D1C4B0' }}
                  aria-label="Start voice recording"
                >
                  🎙️ Record Voice Note
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm text-white"
                  style={{ background: '#dc2626' }}
                  aria-label="Stop voice recording"
                >
                  ⏹ Stop Recording
                </button>
              )}
              {voiceFile && (
                <span className="text-sm font-ui text-brand-accent">
                  ✓ Voice note ready ({(voiceFile.size / 1024).toFixed(0)} KB)
                </span>
              )}
            </div>
          </div>

          {/* Text input — optional */}
          <div>
            <label
              htmlFor="text-description"
              className="block text-sm font-ui font-medium text-brand-text mb-2"
            >
              Description in your language{' '}
              <span className="text-brand-muted font-normal">(optional)</span>
            </label>
            <textarea
              id="text-description"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={4}
              placeholder="Describe your product in any language..."
              className="w-full px-4 py-3 rounded-lg border font-ui text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              style={{ borderColor: '#D1C4B0' }}
            />
          </div>

          {jobStatus && (
            <p className="font-ui text-sm p-4 rounded-lg" role="status"
              style={{ background: 'var(--color-surface)' }}>
              {jobStatus}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || images.length === 0}
            className="w-full py-4 px-6 rounded-lg text-white font-ui font-medium hover:opacity-90
              disabled:opacity-50 disabled:cursor-not-allowed transition"
            style={{ background: 'var(--color-accent)' }}
          >
            {submitting ? 'Uploading & processing…' : 'Create Product Listing'}
          </button>

          <p className="text-center text-xs font-ui text-brand-muted">
            Our AI will enhance your photos and generate the full catalog automatically.
          </p>
        </form>
      </div>
    </main>
  );
}
