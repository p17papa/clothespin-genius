import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ArrowRight, User, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from "sonner";
import { removeBackground, loadImage, blobToDataUrl } from "@/lib/backgroundRemoval";

const Setup = () => {
  const navigate = useNavigate();
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [tops, setTops] = useState<string[]>([]);
  const [bottoms, setBottoms] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [captureMode, setCaptureMode] = useState<'top' | 'bottom'>('top');

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatarImage');
    const savedTops = localStorage.getItem('tops');
    const savedBottoms = localStorage.getItem('bottoms');
    
    if (savedAvatar) {
      setAvatarImage(savedAvatar);
    }
    if (savedTops) {
      setTops(JSON.parse(savedTops));
    }
    if (savedBottoms) {
      setBottoms(JSON.parse(savedBottoms));
    }
  }, []);

  const captureAvatar = async () => {
    try {
      setIsProcessing(true);
      toast.info("Capturing photo...");
      
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800,
        height: 1200,
      });
      
      if (image.dataUrl) {
        toast.info("Removing background...");
        
        // Remove background
        const img = await loadImage(image.dataUrl);
        const processedBlob = await removeBackground(img);
        const processedDataUrl = await blobToDataUrl(processedBlob);
        
        setAvatarImage(processedDataUrl);
        localStorage.setItem('avatarImage', processedDataUrl);
        toast.success("Body photo captured and processed!");
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast.error("Failed to process photo");
    } finally {
      setIsProcessing(false);
    }
  };

  const captureClothing = async () => {
    try {
      setIsProcessing(true);
      toast.info("Capturing photo...");
      
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      
      if (image.dataUrl) {
        toast.info("Removing background...");
        
        // Remove background from clothing item
        const img = await loadImage(image.dataUrl);
        const processedBlob = await removeBackground(img);
        const processedDataUrl = await blobToDataUrl(processedBlob);
        
        if (captureMode === 'top') {
          const newTops = [...tops, processedDataUrl];
          setTops(newTops);
          localStorage.setItem('tops', JSON.stringify(newTops));
          toast.success(`Top captured (${newTops.length} total)`);
        } else {
          const newBottoms = [...bottoms, processedDataUrl];
          setBottoms(newBottoms);
          localStorage.setItem('bottoms', JSON.stringify(newBottoms));
          toast.success(`Bottom captured (${newBottoms.length} total)`);
        }
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast.error("Failed to capture photo");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (!avatarImage) {
      toast.error("Please capture your body photo first");
      return;
    }
    if (tops.length === 0 || bottoms.length === 0) {
      toast.error("Please capture at least one top and one bottom");
      return;
    }
    
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
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-medium mb-4 bg-muted">
              <img 
                src={avatarImage} 
                alt="Your avatar" 
                className="w-full h-full object-contain"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={captureAvatar}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Retake
                  </>
                )}
              </Button>
            </div>
          ) : (
            <button
              onClick={captureAvatar}
              disabled={isProcessing}
              className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-4 group disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-20 h-20 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="font-semibold text-foreground mb-1">Processing...</p>
                    <p className="text-sm text-muted-foreground">Removing background</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground mb-1">Take a full body photo</p>
                    <p className="text-sm text-muted-foreground">Stand straight, well-lit area</p>
                  </div>
                </>
              )}
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

          {/* Category Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={captureMode === 'top' ? 'default' : 'outline'}
              onClick={() => setCaptureMode('top')}
              className="flex-1"
            >
              Tops ({tops.length})
            </Button>
            <Button
              variant={captureMode === 'bottom' ? 'default' : 'outline'}
              onClick={() => setCaptureMode('bottom')}
              className="flex-1"
            >
              Bottoms ({bottoms.length})
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {(captureMode === 'top' ? tops : bottoms).map((item, idx) => (
              <div 
                key={idx}
                className="aspect-square rounded-lg overflow-hidden shadow-soft bg-muted"
              >
                <img 
                  src={item} 
                  alt={`${captureMode} ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
            
            <button
              onClick={captureClothing}
              disabled={isProcessing}
              className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <p className="text-xs text-muted-foreground font-medium">Add {captureMode === 'top' ? 'Top' : 'Bottom'}</p>
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {tops.length === 0 && bottoms.length === 0
              ? "Capture your tops and bottoms separately" 
              : `${tops.length} tops, ${bottoms.length} bottoms captured`}
          </p>
        </div>

        {/* Continue Button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!avatarImage || tops.length === 0 || bottoms.length === 0}
        >
          Continue to Stylist
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Setup;
