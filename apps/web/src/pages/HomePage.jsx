
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1673539554001-8c1a1fae1694',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Premium Photography Portfolio - Cinematic Visual Stories</title>
        <meta
          name="description"
          content="Explore a curated collection of premium photography featuring black & white and color imagery. Professional portfolio showcasing street, portrait, and architectural photography."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0b1d3a]">
        <Header />

        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentImageIndex]}
                alt="Premium photography showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            >
              Premium Photography Portfolio
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Capturing moments through the lens of artistry and precision
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/gallery">
                <Button className="bg-white text-[#0b1d3a] hover:bg-gray-200 text-lg px-8 py-6 rounded-full">
                  Explore Gallery
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  About the Collection
                </h2>
                <p className="text-gray-300 text-lg mb-4">
                  A carefully curated selection of photography that explores the intersection
                  of light, shadow, and human experience. Each image tells a story, frozen
                  in time yet alive with emotion.
                </p>
                <p className="text-gray-300 text-lg">
                  From the stark beauty of black and white to the vibrant energy of color,
                  this portfolio represents years of dedication to the craft of visual storytelling.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0f2847] p-6 rounded-lg">
                  <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
                  <p className="text-gray-400">Photos Captured</p>
                </div>
                <div className="bg-[#0f2847] p-6 rounded-lg">
                  <h3 className="text-3xl font-bold text-white mb-2">7</h3>
                  <p className="text-gray-400">Categories</p>
                </div>
                <div className="bg-[#0f2847] p-6 rounded-lg">
                  <h3 className="text-3xl font-bold text-white mb-2">2</h3>
                  <p className="text-gray-400">Collections</p>
                </div>
                <div className="bg-[#0f2847] p-6 rounded-lg">
                  <h3 className="text-3xl font-bold text-white mb-2">∞</h3>
                  <p className="text-gray-400">Inspiration</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
