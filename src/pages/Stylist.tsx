import { useState, useEffect, useRef, TouchEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Shuffle, Heart, X, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OutfitCombination {
  top?: string;
  bottom?: string;
}

const Stylist = () => {
  const navigate = useNavigate();
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [tops, setTops] = useState<string[]>([]);
  const [bottoms, setBottoms] = useState<string[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitCombination>({});
  const [currentIndices, setCurrentIndices] = useState({ top: 0, bottom: 0 });
  const [likedOutfits, setLikedOutfits] = useState<OutfitCombination[]>([]);
  const [activeSwipeZone, setActiveSwipeZone] = useState<'top' | 'bottom' | null>(null);
  
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    const avatar = localStorage.getItem('avatarImage');
    const savedTops = localStorage.getItem('tops');
    const savedBottoms = localStorage.getItem('bottoms');
    
    if (!avatar || !savedTops || !savedBottoms) {
      navigate('/setup');
      return;
    }
    
    setAvatarImage(avatar);
    const parsedTops = JSON.parse(savedTops);
    const parsedBottoms = JSON.parse(savedBottoms);
    setTops(parsedTops);
    setBottoms(parsedBottoms);
    
    // Initialize with first items
    if (parsedTops.length > 0 && parsedBottoms.length > 0) {
      setCurrentOutfit({
        top: parsedTops[0],
        bottom: parsedBottoms[0],
      });
    }
  }, [navigate]);

  const cycleItem = (category: 'top' | 'bottom', direction: 'next' | 'prev') => {
    const items = category === 'top' ? tops : bottoms;
    const itemCount = items.length;
    if (itemCount === 0) return;

    const currentIndex = currentIndices[category];
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % itemCount;
    } else {
      newIndex = currentIndex === 0 ? itemCount - 1 : currentIndex - 1;
    }

    setCurrentIndices(prev => ({ ...prev, [category]: newIndex }));
    setCurrentOutfit(prev => ({ ...prev, [category]: items[newIndex] }));
  };

  const randomizeOutfit = () => {
    if (tops.length === 0 || bottoms.length === 0) return;
    
    const randomTop = Math.floor(Math.random() * tops.length);
    const randomBottom = Math.floor(Math.random() * bottoms.length);
    
    setCurrentIndices({ top: randomTop, bottom: randomBottom });
    setCurrentOutfit({
      top: tops[randomTop],
      bottom: bottoms[randomBottom],
    });
    
    toast.success("New outfit generated!");
  };

  const likeOutfit = () => {
    setLikedOutfits([...likedOutfits, currentOutfit]);
    toast.success("Outfit saved to favorites!");
  };

  const skipOutfit = () => {
    randomizeOutfit();
  };

  const handleTouchStart = (e: TouchEvent, zone: 'top' | 'bottom') => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setActiveSwipeZone(zone);
  };

  const handleTouchEnd = (e: TouchEvent, zone: 'top' | 'bottom') => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    // Only register as swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        cycleItem(zone, 'next');
      } else {
        cycleItem(zone, 'prev');
      }
    }
    
    setActiveSwipeZone(null);
  };

  const resetAvatar = () => {
    navigate('/setup');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/setup">
                <h1 className="font-serif text-2xl font-bold text-foreground">Ntoulapa</h1>
              </Link>
              <Button variant="ghost" size="sm" onClick={resetAvatar}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <Link to="/favorites">
              <Button variant="ghost" size="sm">
                <Heart className="w-5 h-5 mr-2" />
                {likedOutfits.length}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Swipe to Style
          </h2>
          <p className="text-muted-foreground">
            Swipe each section to find your perfect outfit
          </p>
        </div>

        {/* Avatar with Outfit Overlay */}
        <div className="relative mb-8">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-strong bg-muted relative">
            {avatarImage && (
              <img 
                src={avatarImage} 
                alt="Your avatar" 
                className="w-full h-full object-contain"
              />
            )}
            
            {/* Outfit items overlaid positioned on body */}
            <div className="absolute inset-0">
              {/* Top - positioned on torso (15-50% from top) */}
              {currentOutfit.top && (
                <div 
                  className={`absolute left-1/2 -translate-x-1/2 w-[70%] top-[15%] transition-opacity ${
                    activeSwipeZone === 'top' ? 'opacity-70' : 'opacity-90'
                  }`}
                  onTouchStart={(e) => handleTouchStart(e, 'top')}
                  onTouchEnd={(e) => handleTouchEnd(e, 'top')}
                  style={{ touchAction: 'none', maxHeight: '35%' }}
                >
                  <img 
                    src={currentOutfit.top} 
                    alt="Top" 
                    className="w-full h-auto object-contain drop-shadow-lg pointer-events-none" 
                  />
                </div>
              )}
              
              {/* Bottom - positioned on legs (48-80% from top) */}
              {currentOutfit.bottom && (
                <div 
                  className={`absolute left-1/2 -translate-x-1/2 w-[65%] top-[48%] transition-opacity ${
                    activeSwipeZone === 'bottom' ? 'opacity-70' : 'opacity-90'
                  }`}
                  onTouchStart={(e) => handleTouchStart(e, 'bottom')}
                  onTouchEnd={(e) => handleTouchEnd(e, 'bottom')}
                  style={{ touchAction: 'none', maxHeight: '40%' }}
                >
                  <img 
                    src={currentOutfit.bottom} 
                    alt="Bottom" 
                    className="w-full h-auto object-contain drop-shadow-lg pointer-events-none" 
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Swipe instruction */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Swipe left or right on clothing items to change
          </p>
        </div>

        {/* Swipe Controls */}
        <div className="space-y-4 mb-8">
          {/* Top Control */}
          <div className="bg-card rounded-xl p-4 shadow-soft flex items-center justify-between">
            <span className="font-semibold text-foreground">Top</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => cycleItem('top', 'prev')}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => cycleItem('top', 'next')}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Bottom Control */}
          <div className="bg-card rounded-xl p-4 shadow-soft flex items-center justify-between">
            <span className="font-semibold text-foreground">Bottom</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => cycleItem('bottom', 'prev')}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => cycleItem('bottom', 'next')}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={skipOutfit}
          >
            <X className="w-5 h-5 mr-2" />
            Skip
          </Button>
          
          <Button
            variant="accent"
            size="lg"
            className="flex-1"
            onClick={likeOutfit}
          >
            <Heart className="w-5 h-5 mr-2" />
            Save
          </Button>
        </div>

        <Button
          variant="secondary"
          className="w-full mt-4"
          onClick={randomizeOutfit}
        >
          <Shuffle className="w-5 h-5 mr-2" />
          Randomize Outfit
        </Button>
      </div>
    </div>
  );
};

export default Stylist;
