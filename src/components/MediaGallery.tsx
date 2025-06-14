
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { uploadImageToStorage, deleteImageFromStorage, isSupabaseStorageUrl } from '@/utils/supabaseImageStorage';
import { useToast } from '@/hooks/use-toast';

interface MediaGalleryProps {
  onInsert: (imageUrl: string, caption?: string, width?: string, height?: string, alignment?: string) => void;
  onClose: () => void;
}

export const MediaGallery = ({ onInsert, onClose }: MediaGalleryProps) => {
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; name: string }>>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [sizePreset, setSizePreset] = useState('medium');
  const [alignment, setAlignment] = useState('center');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Enhanced size presets with proper values
  const sizePresets = {
    small: { width: '300px', height: 'auto', label: 'Small (300px)' },
    medium: { width: '500px', height: 'auto', label: 'Medium (500px)' },
    large: { width: '700px', height: 'auto', label: 'Large (700px)' },
    full: { width: '100%', height: 'auto', label: 'Full Width' },
    custom: { width: customWidth || '400px', height: customHeight || 'auto', label: 'Custom Size' }
  };

  const alignmentOptions = [
    { value: 'left', label: 'Left', icon: AlignLeft },
    { value: 'center', label: 'Center', icon: AlignCenter },
    { value: 'right', label: 'Right', icon: AlignRight }
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsUploading(true);
      
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          console.log('Uploading file to Supabase Storage:', file.name);
          const imageUrl = await uploadImageToStorage(file);
          return { url: imageUrl, name: file.name };
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        setUploadedImages(prev => [...prev, ...uploadedFiles]);
        
        // Auto-select the first uploaded image
        if (uploadedImages.length === 0 && uploadedFiles.length > 0) {
          setSelectedImage(uploadedFiles[0].url);
        }
        
        toast({
          title: "Images Uploaded",
          description: `${uploadedFiles.length} image(s) uploaded to Supabase Storage successfully.`
        });
      } catch (error) {
        console.error('Error uploading images:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload one or more images. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = async (urlToRemove: string) => {
    try {
      // If it's a Supabase Storage URL, delete it from storage
      if (isSupabaseStorageUrl(urlToRemove)) {
        await deleteImageFromStorage(urlToRemove);
      }
      
      setUploadedImages(prev => prev.filter(img => img.url !== urlToRemove));
      if (selectedImage === urlToRemove) {
        setSelectedImage('');
      }
      
      toast({
        title: "Image Removed",
        description: "The image has been removed successfully."
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Remove Failed",
        description: "Failed to remove image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInsert = () => {
    if (selectedImage) {
      const selectedSize = sizePresets[sizePreset as keyof typeof sizePresets];
      console.log("Inserting image with enhanced options:", {
        url: selectedImage,
        caption,
        width: selectedSize.width,
        height: selectedSize.height,
        alignment
      });
      onInsert(selectedImage, caption, selectedSize.width, selectedSize.height, alignment);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  {isUploading ? 'Uploading to Supabase Storage...' : 'Upload images for your content'}
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="max-w-xs mx-auto"
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#20466d] mx-auto"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image Gallery */}
          {uploadedImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage === image.url ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-primary" />
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
                    <p className="text-xs text-muted-foreground mt-1 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Image Settings */}
          {selectedImage && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={selectedImage}
                    alt="Selected preview"
                    className={`max-h-64 object-contain mx-auto ${
                      alignment === 'left' ? 'mr-auto ml-0' : 
                      alignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'
                    }`}
                    style={{ 
                      width: sizePresets[sizePreset as keyof typeof sizePresets].width,
                      maxWidth: '100%'
                    }}
                  />
                  {caption && (
                    <p className="text-sm text-muted-foreground mt-2 italic text-center">{caption}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Image Settings</h3>
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

                  <div>
                    <Label htmlFor="alt-text">Alt Text (for accessibility)</Label>
                    <Input
                      id="alt-text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe the image"
                    />
                  </div>
                  
                  <div>
                    <Label>Image Size</Label>
                    <Select value={sizePreset} onValueChange={setSizePreset}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (300px)</SelectItem>
                        <SelectItem value="medium">Medium (500px)</SelectItem>
                        <SelectItem value="large">Large (700px)</SelectItem>
                        <SelectItem value="full">Full Width (100%)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Alignment</Label>
                    <div className="flex gap-2 mt-2">
                      {alignmentOptions.map(({ value, label, icon: Icon }) => (
                        <Button
                          key={value}
                          variant={alignment === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAlignment(value)}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {sizePreset === 'custom' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="custom-width">Width</Label>
                        <Input
                          id="custom-width"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(e.target.value)}
                          placeholder="400px or 50%"
                        />
                      </div>
                      <div>
                        <Label htmlFor="custom-height">Height</Label>
                        <Input
                          id="custom-height"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(e.target.value)}
                          placeholder="auto or 300px"
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded">
                    <strong>Current settings:</strong><br/>
                    Size: {sizePresets[sizePreset as keyof typeof sizePresets].label}<br/>
                    Alignment: {alignment}<br/>
                    {caption && `Caption: "${caption}"`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!selectedImage || isUploading}>
            Insert Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
