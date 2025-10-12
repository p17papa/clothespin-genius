import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Shuffle, Heart, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OutfitCombination {
  top?: string;
  bottom?: string;
  shoes?: string;
}

const Stylist = () => {
  const navigate = useNavigate();
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [clothingItems, setClothingItems] = useState<string[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitCombination>({});
  const [currentIndices, setCurrentIndices] = useState({ top: 0, bottom: 0, shoes: 0 });
  const [likedOutfits, setLikedOutfits] = useState<OutfitCombination[]>([]);

  useEffect(() => {
    const avatar = localStorage.getItem('avatarImage');
    const items = localStorage.getItem('clothingItems');
    
    if (!avatar || !items) {
      navigate('/setup');
      return;
    }
    
    setAvatarImage(avatar);
    const parsedItems = JSON.parse(items);
    setClothingItems(parsedItems);
    
    // Initialize with first items
    if (parsedItems.length > 0) {
      setCurrentOutfit({
        top: parsedItems[0],
        bottom: parsedItems[1] || parsedItems[0],
        shoes: parsedItems[2] || parsedItems[0],
      });
    }
  }, [navigate]);

  const cycleItem = (category: 'top' | 'bottom' | 'shoes', direction: 'next' | 'prev') => {
    const itemCount = clothingItems.length;
    if (itemCount === 0) return;

    const currentIndex = currentIndices[category];
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % itemCount;
    } else {
      newIndex = currentIndex === 0 ? itemCount - 1 : currentIndex - 1;
    }

    setCurrentIndices(prev => ({ ...prev, [category]: newIndex }));
    setCurrentOutfit(prev => ({ ...prev, [category]: clothingItems[newIndex] }));
  };

  const randomizeOutfit = () => {
    if (clothingItems.length === 0) return;
    
    const randomTop = Math.floor(Math.random() * clothingItems.length);
    const randomBottom = Math.floor(Math.random() * clothingItems.length);
    const randomShoes = Math.floor(Math.random() * clothingItems.length);
    
    setCurrentIndices({ top: randomTop, bottom: randomBottom, shoes: randomShoes });
    setCurrentOutfit({
      top: clothingItems[randomTop],
      bottom: clothingItems[randomBottom],
      shoes: clothingItems[randomShoes],
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/setup">
              <h1 className="font-serif text-2xl font-bold text-foreground">Ntoulapa</h1>
            </Link>
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
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-strong bg-muted">
            {avatarImage && (
              <img 
                src={avatarImage} 
                alt="Your avatar" 
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Outfit items overlaid (simplified visual representation) */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              {currentOutfit.top && (
                <div className="h-1/3 rounded-lg overflow-hidden shadow-medium opacity-80">
                  <img src={currentOutfit.top} alt="Top" className="w-full h-full object-cover" />
                </div>
              )}
              {currentOutfit.bottom && (
                <div className="h-1/3 rounded-lg overflow-hidden shadow-medium opacity-80">
                  <img src={currentOutfit.bottom} alt="Bottom" className="w-full h-full object-cover" />
                </div>
              )}
              {currentOutfit.shoes && (
                <div className="h-1/4 rounded-lg overflow-hidden shadow-medium opacity-80">
                  <img src={currentOutfit.shoes} alt="Shoes" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
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

          {/* Shoes Control */}
          <div className="bg-card rounded-xl p-4 shadow-soft flex items-center justify-between">
            <span className="font-semibold text-foreground">Shoes</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => cycleItem('shoes', 'prev')}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => cycleItem('shoes', 'next')}
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
