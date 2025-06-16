
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Image, Zap, Info } from "lucide-react";
import { uploadImageToStorage, deleteImageFromStorage, isSupabaseStorageUrl } from "@/utils/supabaseImageStorage";
import { optimizeImage, DEFAULT_OPTIMIZATION_OPTIONS } from "@/utils/imageOptimization";
import { useToast } from "@/hooks/use-toast";

interface OptimizedImageUploadProps {
  image: string;
  onImageChange: (image: string) => void;
}

export const OptimizedImageUpload = ({ image, onImageChange }: OptimizedImageUploadProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationStats, setOptimizationStats] = useState<{
    originalSize: number;
    optimizedSize: number;
    savings: number;
  } | null>(null);
  const { toast } = useToast();

  const handleOptimizedImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsOptimizing(true);
    setOptimizationProgress(10);
    
    try {
      console.log('Starting optimized image upload process...');
      const originalSize = file.size;
      
      // Step 1: Optimize image
      setOptimizationProgress(30);
      const optimizedFile = await optimizeImage(file, {
        ...DEFAULT_OPTIMIZATION_OPTIONS,
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.8
      });
      
      const optimizedSize = optimizedFile.size;
      const savings = Math.round((1 - optimizedSize / originalSize) * 100);
      
      setOptimizationStats({
        originalSize,
        optimizedSize,
        savings
      });
      
      // Step 2: Upload to Supabase Storage
      setOptimizationProgress(70);
      const imageUrl = await uploadImageToStorage(optimizedFile);
      
      setOptimizationProgress(100);
      onImageChange(imageUrl);
      
      toast({
        title: "Image Optimized & Uploaded",
        description: `Reduced file size by ${savings}% (${Math.round(originalSize/1024)}KB → ${Math.round(optimizedSize/1024)}KB)`
      });
      
    } catch (error) {
      console.error('Error in optimized upload:', error);
      toast({
        title: "Upload Failed", 
        description: "Failed to optimize and upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
      setOptimizationProgress(0);
    }
  };

  const removeImage = async () => {
    try {
      if (image && isSupabaseStorageUrl(image)) {
        await deleteImageFromStorage(image);
      }
      onImageChange("");
      setOptimizationStats(null);
      
      toast({
        title: "Image Removed",
        description: "The image has been removed successfully."
      });
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-green-600" />
          Optimized Image Upload
        </CardTitle>
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Auto-optimization enabled:</p>
            <ul className="text-xs mt-1 space-y-1">
              <li>• Images compressed to WebP format</li>
              <li>• Max size: 1200x800px</li>
              <li>• Quality: 80% (optimal balance)</li>
              <li>• Typical savings: 60-80%</li>
            </ul>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isOptimizing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Optimizing image...</span>
              <span>{optimizationProgress}%</span>
            </div>
            <Progress value={optimizationProgress} className="h-2" />
          </div>
        )}

        {image && !isOptimizing ? (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full max-h-64 object-cover rounded-lg"
                loading="lazy"
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

            {optimizationStats && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-600">Original</div>
                  <div className="font-medium">{Math.round(optimizationStats.originalSize/1024)}KB</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-xs text-green-600">Optimized</div>
                  <div className="font-medium text-green-700">{Math.round(optimizationStats.optimizedSize/1024)}KB</div>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-xs text-blue-600">Saved</div>
                  <div className="font-medium text-blue-700">{optimizationStats.savings}%</div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Replace Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleOptimizedImageUpload}
                className="max-w-xs"
                disabled={isOptimizing}
              />
            </div>
          </div>
        ) : !isOptimizing && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4">Upload and auto-optimize your image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleOptimizedImageUpload}
              className="max-w-xs mx-auto"
              disabled={isOptimizing}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
