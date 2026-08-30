import Image from 'next/image';

export type BorderVariant = 'folk' | 'border-1' | 'border-2' | 'border-3' | 'border-4' | 1 | 2 | 3 | 4;

interface FolkArtBannerProps {
  className?: string;
  height?: number;
  variant?: BorderVariant;
  alt?: string;
}

const BORDER_MAP: Record<string, string> = {
  folk: '/images/folk_art_border.jpg',
  'border-1': '/images/borders/border-1.jpg',
  'border-2': '/images/borders/border-2.jpg',
  'border-3': '/images/borders/border-3.jpg',
  'border-4': '/images/borders/border-4.jpg',
  '1': '/images/borders/border-1.jpg',
  '2': '/images/borders/border-2.jpg',
  '3': '/images/borders/border-3.jpg',
  '4': '/images/borders/border-4.jpg',
};

export default function FolkArtBanner({
  className = '',
  height = 70,
  variant = 'folk',
  alt = 'Indian heritage folk art tapestry border',
}: FolkArtBannerProps) {
  const imageSrc = BORDER_MAP[String(variant)] || '/images/folk_art_border.jpg';

  return (
    <div
      className={`relative w-full overflow-hidden select-none border-y border-amber-950/40 shadow-md ${className}`}
      style={{ height: `${height}px` }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={variant === 'folk'}
      />
      {/* Subtle vignettes to cleanly blend background cuts */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
}
