
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram } from 'lucide-react';
import Header from '@/components/Header.jsx';
import PhotoLightbox from '@/components/PhotoLightbox.jsx';
import pb from '@/lib/pocketbaseClient';

const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState('Black & White');
  const [photos, setPhotos] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchPhotos = async () => {
    setLoading(true);
    
    if (activeTab === 'Social') {
      setPhotos([]);
      setAllTags([]);
      setSelectedTag(null);
      setLoading(false);
      return;
    }

    try {
      const records = await pb.collection('photos').getFullList({
        filter: `category = "${activeTab}"`,
        sort: '-createdAt',
        $autoCancel: false
      });

      setPhotos(records);

      const tags = new Set();
      records.forEach(photo => {
        if (photo.tags) {
          photo.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
      setSelectedTag(null); // Reset tag filter when switching tabs
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Social') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observerRef.current.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [photos, activeTab]); // Re-bind observer when photos change

  const filterPhotosByTag = (photosList) => {
    if (!selectedTag) return photosList;
    return photosList.filter(photo => photo.tags && photo.tags.includes(selectedTag));
  };

  const PhotoCard = ({ photo, index }) => {
    const imageUrl = photo.image ? pb.files.getUrl(photo, photo.image) : '';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative overflow-hidden rounded-lg cursor-pointer bg-[#0f2847] aspect-[4/5]"
        onClick={() => setSelectedPhoto(photo)}
      >
        <img
          data-src={imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          ref={(el) => {
            if (el && observerRef.current) {
              observerRef.current.observe(el);
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
          <h3 className="text-white text-2xl font-bold mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{photo.title}</h3>
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
              {photo.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium tracking-wider uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const filteredPhotos = filterPhotosByTag(photos);

  return (
    <>
      <Helmet>
        <title>Gallery - Premium Photography Portfolio</title>
        <meta
          name="description"
          content="Browse our curated collection of black & white and color photography. Filter by tags including street, portrait, art, urban, architecture, landscape, and documentary."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0b1d3a]">
        <Header />

        <div className="pt-32 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-12 text-center tracking-tight"
            >
              Gallery
            </motion.h1>

            {/* Category Tabs */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              {['Black & White', 'Color', 'Social'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-white text-[#0b1d3a] shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                      : 'bg-[#0f2847] text-gray-400 hover:bg-[#1a3a5c] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Social' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-24 px-4 text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Connect on Instagram</h2>
                <p className="text-gray-400 mb-10 max-w-md">
                  Follow my journey, see behind-the-scenes content, and stay updated with my latest photography projects.
                </p>
                <a
                  href="https://instagram.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-8 py-4 bg-[#0f2847] hover:bg-[#1a3a5c] text-white rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 border border-gray-700 hover:border-gray-500"
                >
                  <Instagram size={24} className="group-hover:text-pink-500 transition-colors duration-300" />
                  <span>Follow @yourprofile</span>
                </a>
              </motion.div>
            ) : (
              <>
                {/* Tag Filters */}
                {allTags.length > 0 && !loading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12 flex flex-wrap gap-3 justify-center"
                  >
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                        !selectedTag
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-[#0f2847] text-gray-400 hover:bg-[#1a3a5c] hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                          selectedTag === tag
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-[#0f2847] text-gray-400 hover:bg-[#1a3a5c] hover:text-white'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Photo Grid */}
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {filteredPhotos.map((photo, index) => (
                        <PhotoCard key={photo.id} photo={photo} index={index} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}

                {!loading && filteredPhotos.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-400 py-20 text-lg"
                  >
                    No photos found in this category with the selected filters.
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        {selectedPhoto && (
          <PhotoLightbox
            photo={selectedPhoto}
            photos={filteredPhotos}
            onClose={() => setSelectedPhoto(null)}
            onTagClick={(tag) => setSelectedTag(tag)}
          />
        )}
      </div>
    </>
  );
};

export default GalleryPage;
