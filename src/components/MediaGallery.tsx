
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface MediaGalleryProps {
  onInsert: (imageUrl: string, caption?: string) => void;
  onClose: () => void;
}

export const MediaGallery = ({ onInsert, onClose }: MediaGalleryProps) => {
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; name: string }>>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [caption, setCaption] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setUploadedImages(prev => [...prev, { url: imageUrl, name: file.name }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (urlToRemove: string) => {
    setUploadedImages(prev => prev.filter(img => img.url !== urlToRemove));
    if (selectedImage === urlToRemove) {
      setSelectedImage('');
    }
  };

  const handleInsert = () => {
    if (selectedImage) {
      onInsert(selectedImage, caption);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Media Gallery</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Upload images for your report</p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Gallery */}
          {uploadedImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
                        selectedImage === image.url ? 'border-[#22aee1]' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 bg-[#22aee1] bg-opacity-20 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-[#22aee1]" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(image.url)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <img
                  src={selectedImage}
                  alt="Selected preview"
                  className="w-full max-h-64 object-contain border rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Image Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image-caption">Caption (optional)</Label>
                    <Input
                      id="image-caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Enter image caption"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!selectedImage}>
            Insert Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
