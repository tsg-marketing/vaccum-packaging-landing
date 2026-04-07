import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface VideoCardProps {
  embedId: string;
  title?: string;
}

export default function VideoCard({ embedId, title }: VideoCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-secondary cursor-pointer"
      >
        <img
          src={`https://rutube.ru/api/video/${embedId}/thumbnail/?redirect=1`}
          alt={title || 'Видео'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Icon name="Play" size={32} className="text-white ml-1" />
          </div>
        </div>
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <span className="text-white text-sm font-medium">{title}</span>
          </div>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-white/80 transition-colors flex items-center gap-2"
            >
              <span className="text-sm">Закрыть</span>
              <Icon name="X" size={24} />
            </button>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://rutube.ru/play/embed/${embedId}/?autoplay=1`}
                className="w-full h-full"
                allowFullScreen
                allow="clipboard-write; autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
