import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  caption?: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const GalleryLightbox = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrev = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
    setIsZoomed(false);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
    setIsZoomed(false);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors bg-black/30 rounded-full"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          {/* Zoom Button */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 right-16 z-10 p-2 text-white/80 hover:text-white transition-colors bg-black/30 rounded-full"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-black/30 rounded-full text-white/80 text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 z-10 p-3 text-white/80 hover:text-white transition-colors bg-black/30 rounded-full"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Image */}
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
          >
            <motion.img
              src={currentImage.src}
              alt={currentImage.alt}
              className={`max-h-[75vh] object-contain rounded-lg transition-transform duration-300 ${
                isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              drag={isZoomed}
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            />
            {currentImage.caption && (
              <p className="mt-4 text-white/80 text-center max-w-xl">
                {currentImage.caption}
              </p>
            )}
          </motion.div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 p-3 text-white/80 hover:text-white transition-colors bg-black/30 rounded-full"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-xl overflow-x-auto max-w-[90vw]">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  onNavigate(index);
                  setIsZoomed(false);
                }}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? "ring-2 ring-white opacity-100"
                    : "opacity-50 hover:opacity-75"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryLightbox;
