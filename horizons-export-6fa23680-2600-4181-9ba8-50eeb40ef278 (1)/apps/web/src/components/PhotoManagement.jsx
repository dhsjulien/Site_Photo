
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PhotoEditForm from '@/components/PhotoEditForm.jsx';
import pb from '@/lib/pocketbaseClient';

const PhotoManagement = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(null);

  const fetchPhotos = async () => {
    try {
      const records = await pb.collection('photos').getFullList({
        sort: '-createdAt',
        $autoCancel: false
      });
      setPhotos(records);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch photos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      await pb.collection('photos').delete(id, { $autoCancel: false });
      setPhotos(photos.filter(p => p.id !== id));
      toast({
        title: 'Success',
        description: 'Photo deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleUpdate = (updatedPhoto) => {
    setPhotos(photos.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white text-center py-8">Loading photos...</div>;
  }

  return (
    <div className="bg-[#0f2847] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Photo Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#1a3a5c] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhotos.map((photo) => {
          const imageUrl = photo.image ? pb.files.getUrl(photo, photo.image) : '';
          return (
            <div key={photo.id} className="bg-[#1a3a5c] rounded-lg overflow-hidden">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={photo.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">{photo.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{photo.category}</p>
                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {photo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-gray-400 text-sm mb-3">{photo.views || 0} views</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingPhoto(photo)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(photo.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No photos found
        </div>
      )}

      {editingPhoto && (
        <PhotoEditForm
          photo={editingPhoto}
          onClose={() => setEditingPhoto(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default PhotoManagement;
