import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ArrowRight, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from "sonner";

const Setup = () => {
  const navigate = useNavigate();
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [clothingItems, setClothingItems] = useState<string[]>([]);

  const captureAvatar = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800,
        height: 1200,
      });
      
      if (image.dataUrl) {
        setAvatarImage(image.dataUrl);
        toast.success("Body photo captured!");
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast.error("Failed to capture photo");
    }
  };

  const captureClothing = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      
      if (image.dataUrl) {
        setClothingItems([...clothingItems, image.dataUrl]);
        toast.success(`${clothingItems.length + 1} items captured`);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast.error("Failed to capture photo");
    }
  };

  const handleContinue = () => {
    if (!avatarImage) {
      toast.error("Please capture your body photo first");
      return;
    }
    if (clothingItems.length === 0) {
      toast.error("Please capture at least one clothing item");
      return;
    }
    
    // Store in localStorage for now
    localStorage.setItem('avatarImage', avatarImage);
    localStorage.setItem('clothingItems', JSON.stringify(clothingItems));
    
    navigate('/stylist');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <h1 className="font-serif text-2xl font-bold text-foreground">Ntoulapa</h1>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step 1: Avatar */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold">
              1
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Capture Your Body Photo
            </h2>
          </div>

          {avatarImage ? (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-medium mb-4">
              <img 
                src={avatarImage} 
                alt="Your avatar" 
                className="w-full h-full object-cover"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={captureAvatar}
              >
                <Camera className="w-4 h-4 mr-2" />
                Retake
              </Button>
            </div>
          ) : (
            <button
              onClick={captureAvatar}
              className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-4 group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-10 h-10 text-accent-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground mb-1">Take a full body photo</p>
                <p className="text-sm text-muted-foreground">Stand straight, well-lit area</p>
              </div>
            </button>
          )}
        </div>

        {/* Step 2: Clothing */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
              2
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Capture Your Clothes
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {clothingItems.map((item, idx) => (
              <div 
                key={idx}
                className="aspect-square rounded-lg overflow-hidden shadow-soft"
              >
                <img 
                  src={item} 
                  alt={`Clothing ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            
            <button
              onClick={captureClothing}
              className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 group"
            >
              <Camera className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
              <p className="text-xs text-muted-foreground font-medium">Add Item</p>
            </button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {clothingItems.length === 0 
              ? "Capture all your tops, bottoms, and shoes" 
              : `${clothingItems.length} items captured`}
          </p>
        </div>

        {/* Continue Button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!avatarImage || clothingItems.length === 0}
        >
          Continue to Stylist
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Setup;
