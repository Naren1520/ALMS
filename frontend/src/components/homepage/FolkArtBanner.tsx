import Image from 'next/image';

interface FolkArtBannerProps {
  className?: string;
  height?: number;
}

export default function FolkArtBanner({ className = '', height = 70 }: FolkArtBannerProps) {
  return (
    <div className={`relative w-full overflow-hidden shadow-inner ${className}`} style={{ height: `${height}px` }}>
      <Image
        src="/images/folk_art_border.jpg"
        alt="Indian folk art border motif"
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />
      {/* Subtle border top & bottom highlights */}
      <div className="absolute inset-x-0 top-0 h-1 bg-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20" />
    </div>
  );
}
