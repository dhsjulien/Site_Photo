
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';

const PhotoUploadForm = ({ onUploadSuccess }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Black & White',
    tags: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableTags = ['street', 'portrait', 'art', 'urban', 'architecture', 'landscape', 'documentary'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('jpeg')) {
        toast({
          title: 'Error',
          description: 'Only JPEG images are allowed',
          variant: 'destructive'
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast({
        title: 'Error',
        description: 'Please select an image',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      formData.tags.forEach(tag => data.append('tags', tag));
      data.append('image', imageFile);
      data.append('views', 0);

      await pb.collection('photos').create(data, { $autoCancel: false });

      toast({
        title: 'Success',
        description: 'Photo uploaded successfully'
      });

      setFormData({
        title: '',
        description: '',
        category: 'Black & White',
        tags: []
      });
      setImageFile(null);
      setImagePreview(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f2847] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Upload New Photo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-[#1a3a5c] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-[#1a3a5c] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-[#1a3a5c] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Black & White">Black & White</option>
            <option value="Color">Color</option>
          </select>
        </div>

        <div>
          <label className="block text-white mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.tags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1a3a5c] text-gray-300 hover:bg-[#2a4a6c]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white mb-2">Image (JPEG only)</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/jpeg"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mb-4 rounded-lg"
                />
              ) : (
                <Upload size={48} className="text-gray-400 mb-4" />
              )}
              <span className="text-gray-300">
                {imageFile ? imageFile.name : 'Click to select image'}
              </span>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </form>
    </div>
  );
};

export default PhotoUploadForm;
