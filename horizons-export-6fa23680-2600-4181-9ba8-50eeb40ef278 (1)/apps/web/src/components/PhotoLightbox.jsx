
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';

const PhotoLightbox = ({ photo, photos, onClose, onTagClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(photo);

  useEffect(() => {
    const index = photos.findIndex(p => p.id === photo.id);
    setCurrentIndex(index);
    setCurrentPhoto(photo);
  }, [photo, photos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentPhoto(photos[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentPhoto(photos[newIndex]);
    }
  };

  const imageUrl = currentPhoto.image 
    ? pb.files.getUrl(currentPhoto, currentPhoto.image)
    : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X size={32} />
      </button>

      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
        >
          <ChevronLeft size={48} />
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
        >
          <ChevronRight size={48} />
        </button>
      )}

      <div
        className="max-w-7xl max-h-[90vh] w-full px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <img
              src={imageUrl}
              alt={currentPhoto.title}
              className="max-h-[70vh] w-auto object-contain mb-6"
            />
            <div className="text-white text-center max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">{currentPhoto.title}</h2>
              {currentPhoto.description && (
                <p className="text-gray-300 mb-4">{currentPhoto.description}</p>
              )}
              {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {currentPhoto.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick(tag);
                        onClose();
                      }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-gray-400 text-sm">
                {currentPhoto.views || 0} views
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PhotoLightbox;
