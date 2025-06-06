
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Image, Plus } from "lucide-react";

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
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onImageChange("");
  };

  const getSizePreview = () => {
    const sizes = {
      small: { width: "200px", label: "Small (200px)" },
      medium: { width: "400px", label: "Medium (400px)" },
      large: { width: "600px", label: "Large (600px)" },
      full: { width: "100%", label: "Full Width" }
    };
    return sizes[imageSize];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Featured Image
          {image && onInsertToContent && (
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
        {image ? (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative inline-block w-full">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full max-h-64 object-cover rounded-lg"
                style={{ maxWidth: getSizePreview().width }}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                Remove
              </Button>
            </div>

            {/* Size Controls */}
            {onImageSizeChange && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Image Size</label>
                <div className="flex items-center gap-4">
                  <Select value={imageSize} onValueChange={onImageSizeChange}>
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
              />
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4">Upload a featured image for your report</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="max-w-xs mx-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
