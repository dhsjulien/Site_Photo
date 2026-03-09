
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Camera, Eye, Tag, Upload as UploadIcon } from 'lucide-react';
import Header from '@/components/Header.jsx';
import PhotoManagement from '@/components/PhotoManagement.jsx';
import PhotoUploadForm from '@/components/PhotoUploadForm.jsx';
import pb from '@/lib/pocketbaseClient';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState({
    totalPhotos: 0,
    totalViews: 0,
    topTags: [],
    recentPhotos: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const photos = await pb.collection('photos').getFullList({
        sort: '-createdAt',
        $autoCancel: false
      });

      const totalViews = photos.reduce((sum, photo) => sum + (photo.views || 0), 0);

      const tagCounts = {};
      photos.forEach(photo => {
        if (photo.tags) {
          photo.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

      setAnalytics({
        totalPhotos: photos.length,
        totalViews,
        topTags,
        recentPhotos: photos.slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleUploadSuccess = () => {
    fetchAnalytics();
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Premium Photography Portfolio</title>
        <meta name="description" content="Manage your photography portfolio" />
      </Helmet>

      <div className="min-h-screen bg-[#0b1d3a]">
        <Header />

        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

            <div className="flex gap-4 mb-8 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'analytics'
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'upload'
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Upload Photo
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'manage'
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Manage Photos
              </button>
            </div>

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#0f2847] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg">
                        <Camera className="text-blue-400" size={24} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Photos</p>
                        <p className="text-4xl font-bold text-white">{analytics.totalPhotos}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f2847] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-600/20 rounded-lg">
                        <Eye className="text-green-400" size={24} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Views</p>
                        <p className="text-4xl font-bold text-white">{analytics.totalViews}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f2847] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-purple-600/20 rounded-lg">
                        <Tag className="text-purple-400" size={24} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Unique Tags</p>
                        <p className="text-4xl font-bold text-white">{analytics.topTags.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f2847] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-orange-600/20 rounded-lg">
                        <UploadIcon className="text-orange-400" size={24} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Recent Uploads</p>
                        <p className="text-4xl font-bold text-white">{analytics.recentPhotos.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#0f2847] rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Top Tags</h2>
                    <div className="space-y-3">
                      {analytics.topTags.map(({ tag, count }) => (
                        <div key={tag} className="flex justify-between items-center">
                          <span className="text-gray-300">#{tag}</span>
                          <span className="text-white font-semibold">{count} photos</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0f2847] rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Uploads</h2>
                    <div className="space-y-3">
                      {analytics.recentPhotos.map((photo) => (
                        <div key={photo.id} className="flex justify-between items-center">
                          <span className="text-gray-300 truncate">{photo.title}</span>
                          <span className="text-gray-400 text-sm">{photo.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <PhotoUploadForm onUploadSuccess={handleUploadSuccess} />
            )}

            {activeTab === 'manage' && <PhotoManagement />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
