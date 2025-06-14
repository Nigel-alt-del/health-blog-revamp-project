import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Image, Plus } from "lucide-react";
import { uploadImageToStorage, deleteImageFromStorage, isSupabaseStorageUrl } from "@/utils/supabaseImageStorage";
import { useToast } from "@/hooks/use-toast";

interface FeaturedImageUploadProps {
  image: string;
  imageSize?: "small" | "medium" | "large" | "full";
  onImageChange: (image: string) => void;
  onImageSizeChange?: (size: "small" | "medium" | "large" | "full") => void;
  onInsertToContent?: () => void;
}

export const FeaturedImageUpload = ({ 
  image, 
  imageSize = "medium", 
  onImageChange, 
  onImageSizeChange,
  onInsertToContent 
}: FeaturedImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Starting image upload to Supabase Storage...');
        const imageUrl = await uploadImageToStorage(file);
        onImageChange(imageUrl);
        
        toast({
          title: "Image Uploaded",
          description: "Your image has been uploaded to Supabase Storage successfully."
        });
      } catch (err) {
        console.error('Error uploading image:', err);
        setError("Failed to upload image. Please try again.");
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeImage = async () => {
    try {
      // If it's a Supabase Storage URL, delete it from storage
      if (image && isSupabaseStorageUrl(image)) {
        await deleteImageFromStorage(image);
      }
      
      onImageChange("");
      setError(null);
      
      toast({
        title: "Image Removed",
        description: "The image has been removed successfully."
      });
    } catch (err) {
      console.error('Error removing image:', err);
      setError("Error removing image");
    }
  };

  const handleSizeChange = (size: "small" | "medium" | "large" | "full") => {
    try {
      if (onImageSizeChange) {
        onImageSizeChange(size);
      }
      setError(null);
    } catch (err) {
      setError("Error changing image size");
    }
  };

  const getSizePreview = () => {
    const sizes = {
      small: { width: "200px", label: "Small (200px)" },
      medium: { width: "400px", label: "Medium (400px)" },
      large: { width: "600px", label: "Large (600px)" },
      full: { width: "100%", label: "Full Width" }
    };
    return sizes[imageSize] || sizes.medium;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Featured Image
          {image && onInsertToContent && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={onInsertToContent}
              className="ml-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Insert to Content
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {isLoading && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20466d] mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Uploading to Supabase Storage...</p>
          </div>
        )}

        {image && !isLoading ? (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative inline-block w-full">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full max-h-64 object-cover rounded-lg"
                style={{ maxWidth: getSizePreview().width }}
                onError={() => setError("Failed to display image")}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
                disabled={isLoading}
              >
                Remove
              </Button>
            </div>

            {/* Size Controls */}
            {onImageSizeChange && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Image Size</label>
                <div className="flex items-center gap-4">
                  <Select value={imageSize} onValueChange={handleSizeChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (200px)</SelectItem>
                      <SelectItem value="medium">Medium (400px)</SelectItem>
                      <SelectItem value="large">Large (600px)</SelectItem>
                      <SelectItem value="full">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline">{getSizePreview().label}</Badge>
                </div>
              </div>
            )}

            {/* Replace Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Replace Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-xs"
                disabled={isLoading}
              />
            </div>
          </div>
        ) : !isLoading && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4">Upload a featured image for your report</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="max-w-xs mx-auto"
              disabled={isLoading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
