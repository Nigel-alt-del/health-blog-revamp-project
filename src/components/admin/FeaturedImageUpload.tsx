
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturedImageUploadProps {
  image: string;
  onImageChange: (image: string) => void;
}

export const FeaturedImageUpload = ({ image, onImageChange }: FeaturedImageUploadProps) => {
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

  return (
    <Card>
      <CardContent className="pt-6">
        <label className="block text-sm font-medium mb-2">Featured Image</label>
        <div className="space-y-4">
          {image ? (
            <div className="relative inline-block">
              <img src={image} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-xs mx-auto"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
