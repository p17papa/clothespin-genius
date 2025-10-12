import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface OutfitCombination {
  top?: string;
  bottom?: string;
  shoes?: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<OutfitCombination[]>([]);

  useEffect(() => {
    // In a real app, this would load from persistent storage
    // For now, it's just a placeholder
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/stylist">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="font-serif text-2xl font-bold text-foreground">Favorites</h1>
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {favorites.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              No favorites yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start swiping and save your favorite outfit combinations
            </p>
            <Link to="/stylist">
              <Button variant="accent">
                Start Styling
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {favorites.map((outfit, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex gap-4">
                  {outfit.top && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden shadow-soft">
                      <img src={outfit.top} alt="Top" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {outfit.bottom && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden shadow-soft">
                      <img src={outfit.bottom} alt="Bottom" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {outfit.shoes && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden shadow-soft">
                      <img src={outfit.shoes} alt="Shoes" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
