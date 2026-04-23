import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon } from 'lucide-react';

const RAW_DATA = [
  "1:진지", "2:부끄", "3:폭소", "4:당황", "5:놀람", "6:유혹", "7:눈물", "8:분노",
  "9:정상위", "10:파이즈리", "11:펠라", "12:핸드잡", "13:리버스 카우걸", "14:후배위", "15:에프터 펠라치오",
  "16:핑거링", "17:커닐링구스", "18:이라마치오", "19:절정", "20:풋잡", "21:수유대딸", "22:들박",
  "23:풀넬슨", "24:측위", "25:여성상위", "26:정상위", "27:파이즈리", "28:펠라", "29:핸드잡",
  "30:리버스 카우걸", "31:후배위", "32:에프터 펠라치오", "33:핑거링", "34:커닐링구스", "35:이라마치오",
  "36:절정", "37:풋잡", "38:수유대딸", "39:들박", "40:풀넬슨", "41:측위", "42:여성상위"
];

const IMAGES = RAW_DATA.map(item => {
  const [idStr, ...titleParts] = item.split(':');
  const idStrTrimmed = idStr.trim();
  return {
    id: parseInt(idStrTrimmed, 10),
    title: titleParts.join(':').trim(),
    url: `https://pub-b18508b5754e424db3735f525c374aa9.r2.dev/${idStrTrimmed}.jpg`
  };
});

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev === 0 ? IMAGES.length - 1 : prev - 1)));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev === IMAGES.length - 1 ? 0 : prev + 1)));
  }, []);

  const closeZoom = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeZoom();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeZoom, handlePrev, handleNext]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  return (
    <div className="min-h-screen bg-[#F2F0ED] text-[#2C2C2C] font-sans selection:bg-[#D1CEC9] overflow-x-hidden">
      {/* Header Section */}
      <header className="flex flex-col items-center justify-center p-6 md:p-8 border-b border-[#D1CEC9] gap-1 text-center">
        <h1 className="text-2xl md:text-3xl font-light tracking-widest uppercase">
          Image Archive
        </h1>
        <p className="text-[10px] md:text-xs text-[#8C8882] mt-1 md:mt-2 tracking-widest uppercase flex items-center justify-center gap-2">
          <ImageIcon size={14} className="md:hidden" />
          Curated Visual Collection • Volume 01
        </p>
      </header>

      {/* Album Grid */}
      <main className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 pb-12">
        {IMAGES.map((img, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx % 12) * 0.03, duration: 0.4 }}
            key={img.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative cursor-pointer bg-white p-2 md:p-2.5 shadow-sm block transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="aspect-square bg-[#E5E2DD] overflow-hidden flex items-center justify-center mb-2 md:mb-3 relative">
              <img 
                src={img.url} 
                alt={img.title} 
                loading="lazy" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x600/E5E2DD/8C8882?text=Not+Found`;
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-[#2C2C2C]/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md scale-75 group-hover:scale-100" size={28} />
              </div>
            </div>
            <div className="flex flex-col items-center pb-1">
              <p className="text-[10px] md:text-[11px] text-center font-medium text-[#2C2C2C] tracking-wide">
                {String(img.id).padStart(2, '0')}. {img.title}
              </p>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeZoom}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12"
          >
            <button 
              onClick={closeZoom} 
              className="absolute top-6 right-6 md:top-8 md:right-8 text-white/50 hover:text-white z-[110] p-2 hover:rotate-90 transition-transform duration-300"
              aria-label="Close fullscreen"
            >
              <X size={36} strokeWidth={1} />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
              className="absolute left-2 md:left-8 text-white/30 hover:text-white/80 p-4 z-[110] transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={44} strokeWidth={1} />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }} 
              className="absolute right-2 md:right-8 text-white/30 hover:text-white/80 p-4 z-[110] transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={44} strokeWidth={1} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col items-center justify-center w-full max-w-5xl max-h-[85vh]"
            >
              <img 
                key={IMAGES[selectedIndex].url}
                src={IMAGES[selectedIndex].url} 
                alt={IMAGES[selectedIndex].title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x800/1A1A1A/8C8882?text=Image+Not+Found`;
                }}
                className="max-w-full max-h-[60vh] md:max-h-[75vh] object-contain shadow-2xl mb-4 md:mb-6" 
              />
              <h2 className="text-white text-lg md:text-2xl font-light tracking-[0.3em] md:tracking-[0.4em] uppercase text-center mt-2 md:mt-4">
                {String(IMAGES[selectedIndex].id).padStart(2, '0')}. {IMAGES[selectedIndex].title}
              </h2>
              <p className="text-gray-400 text-[9px] md:text-xs mt-3 uppercase tracking-widest hidden md:block">
                Click anywhere outside to return
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}