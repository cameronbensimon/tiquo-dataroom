"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface DeckImage {
  id: number;
  src: string;
  alt: string;
}

interface DeckCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: DeckImage[];
}

export default function DeckCarouselModal({ isOpen, onClose, images }: DeckCarouselModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Images are now passed as props for reusability

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: "smooth"
      });
    }
  };

  const nextSlide = () => {
    const nextIndex = currentSlide < images.length - 1 ? currentSlide + 1 : 0;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentSlide > 0 ? currentSlide - 1 : images.length - 1;
    goToSlide(prevIndex);
  };

  // Handle scroll events to update current slide
  const handleScroll = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      const scrollLeft = carouselRef.current.scrollLeft;
      const newSlide = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentSlide, nextSlide, prevSlide, onClose]);

  // Reset to first slide and prevent body scroll when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset to first slide
      setCurrentSlide(0);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ left: 0, behavior: "instant" });
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        >
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Left navigation arrow - outside modal */}
          <button
            onClick={prevSlide}
            className="absolute left-4 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-4 transition-colors backdrop-blur-sm group"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right navigation arrow - outside modal */}
          <button
            onClick={nextSlide}
            className="absolute right-4 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-4 transition-colors backdrop-blur-sm group"
            aria-label="Next image"
          >
            <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close button - outside modal on the right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative bg-white rounded-xl overflow-hidden"
            style={{
              width: "min(90vw, 85vh * (16/9))",
              height: "min(85vh, 90vw * (9/16))",
              maxWidth: "1200px",
              maxHeight: "675px"
            }}
            onClick={(e) => e.stopPropagation()}
          >

          {/* Carousel container using CSS scroll-snap (Blossom Carousel principles) */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto h-full scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onScroll={handleScroll}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {images.map((image, index) => (
              <div
                key={image.id}
                className="flex-none w-full h-full relative"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="relative w-full h-full p-3">
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-xl"
                      priority={index < 2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>


          </motion.div>
          
          {/* Progress bar - positioned outside the modal content */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
              {/* Slide indicators */}
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-6 h-2 rounded-sm transition-all duration-300 ${
                    index === currentSlide 
                      ? "bg-white scale-110" 
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
