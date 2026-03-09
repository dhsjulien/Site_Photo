import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';

const MAX_FILES = 100;

const PhotoUploadForm = ({ onUploadSuccess }) => {
	const { toast } = useToast();

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		category: 'Black & White',
		tags: []
	});

	const [imageFiles, setImageFiles] = useState([]);
	const [imagePreviews, setImagePreviews] = useState([]);
	const [loading, setLoading] = useState(false);

	const availableTags = [
		'street',
		'portrait',
		'art',
		'urban',
		'architecture',
		'landscape',
		'documentary'
	];

	const processFiles = (files) => {
		const fileArray = Array.from(files);

		if (fileArray.length + imageFiles.length > MAX_FILES) {
			toast({
				title: 'Too many images',
				description: `Maximum ${MAX_FILES} images allowed`,
				variant: 'destructive'
			});
			return;
		}

		const validFiles = [];
		const previews = [];

		fileArray.forEach((file) => {
			if (!file.type.includes('jpeg')) {
				toast({
					title: 'Error',
					description: 'Only JPEG images are allowed',
					variant: 'destructive'
				});
				return;
			}

			validFiles.push(file);

			const reader = new FileReader();
			reader.onloadend = () => {
				previews.push(reader.result);

				if (previews.length === validFiles.length) {
					setImagePreviews((prev) => [...prev, ...previews]);
				}
			};

			reader.readAsDataURL(file);
		});

		setImageFiles((prev) => [...prev, ...validFiles]);
	};

	const handleImageChange = (e) => {
		processFiles(e.target.files);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		processFiles(e.dataTransfer.files);
	};

	const toggleTag = (tag) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.includes(tag)
				? prev.tags.filter((t) => t !== tag)
				: [...prev.tags, tag]
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (imageFiles.length === 0) {
			toast({
				title: 'Error',
				description: 'Please select at least one image',
				variant: 'destructive'
			});
			return;
		}

		setLoading(true);

		try {
			for (const file of imageFiles) {
				const data = new FormData();

				data.append('title', formData.title.trim() || 'Untitled');
				data.append('description', formData.description);
				data.append('category', formData.category);
				formData.tags.forEach((tag) => data.append('tags', tag));
				data.append('photo', file);
				data.append('views', 0);

				await pb.collection('photos').create(data, { $autoCancel: false });
			}

			toast({
				title: 'Success',
				description: `${imageFiles.length} photos uploaded`
			});

			setFormData({
				title: '',
				description: '',
				category: 'Black & White',
				tags: []
			});

			setImageFiles([]);
			setImagePreviews([]);

			if (onUploadSuccess) onUploadSuccess();

		} catch (error) {
			toast({
				title: 'Upload error',
				description: error.message,
				variant: 'destructive'
			});
		}

		setLoading(false);
	};

	return (
		<div className="bg-[#0f2847] rounded-lg p-6">
			<h2 className="text-2xl font-bold text-white mb-6">
				Upload Photos
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">

				<div>
					<label className="block text-white mb-2">
						Title
					</label>

					<input
						type="text"
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						className="w-full px-4 py-2 bg-[#1a3a5c] text-white border border-gray-600 rounded-lg"
					/>
				</div>

				<div>
					<label className="block text-white mb-2">
						Description
					</label>

					<textarea
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						className="w-full px-4 py-2 bg-[#1a3a5c] text-white border border-gray-600 rounded-lg h-24"
					/>
				</div>

				<div>
					<label className="block text-white mb-2">
						Category
					</label>

					<select
						value={formData.category}
						onChange={(e) =>
							setFormData({ ...formData, category: e.target.value })
						}
						className="w-full px-4 py-2 bg-[#1a3a5c] text-white border border-gray-600 rounded-lg"
					>
						<option value="Black & White">
							Black & White
						</option>

						<option value="Color">
							Color
						</option>
					</select>
				</div>

				<div>
					<label className="block text-white mb-2">
						Tags
					</label>

					<div className="flex flex-wrap gap-2">
						{availableTags.map((tag) => (
							<button
								key={tag}
								type="button"
								onClick={() => toggleTag(tag)}
								className={`px-3 py-1 rounded-full text-sm ${formData.tags.includes(tag)
										? 'bg-blue-600 text-white'
										: 'bg-[#1a3a5c] text-gray-300'
									}`}
							>
								{tag}
							</button>
						))}
					</div>
				</div>

				<div
					onDragOver={(e) => e.preventDefault()}
					onDrop={handleDrop}
					className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center"
				>
					<input
						type="file"
						accept="image/jpeg"
						multiple
						onChange={handleImageChange}
						className="hidden"
						id="image-upload"
					/>

					<label
						htmlFor="image-upload"
						className="cursor-pointer flex flex-col items-center"
					>
						<Upload size={48} className="text-gray-400 mb-4" />

						<span className="text-gray-300">
							Drag & Drop photos here
						</span>

						<span className="text-gray-400 text-sm">
							or click to select up to 100 images
						</span>
					</label>
				</div>

				{imagePreviews.length > 0 && (
					<div className="grid grid-cols-4 gap-2">
						{imagePreviews.map((preview, index) => (
							<img
								key={index}
								src={preview}
								className="rounded-lg object-cover h-32 w-full"
							/>
						))}
					</div>
				)}

				<Button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700"
				>
					{loading
						? 'Uploading...'
						: `Upload ${imageFiles.length} photos`}
				</Button>

			</form>
		</div>
	);
};

export default PhotoUploadForm;