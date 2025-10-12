import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Shuffle, Plus } from "lucide-react";
import { Link } from "react-router-dom";

// Mock outfit suggestions
const mockOutfits = [
  {
    id: 1,
    name: "Casual Friday",
    items: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300",
    ],
  },
  {
    id: 2,
    name: "Business Chic",
    items: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=300",
    ],
  },
  {
    id: 3,
    name: "Weekend Vibes",
    items: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300",
    ],
  },
];

const Outfits = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <h1 className="font-serif text-2xl font-bold text-foreground">Ntoulapa</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/closet">
                <Button variant="ghost">My Closet</Button>
              </Link>
              <Link to="/outfits">
                <Button variant="ghost">Outfits</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-hero border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full text-sm font-medium text-primary-foreground mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Generated Suggestions
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary-foreground mb-4">
              Your Personal Outfit Suggestions
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Our AI analyzes your wardrobe and creates perfect combinations tailored to your style
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg">
                <Shuffle className="w-5 h-5 mr-2" />
                Generate New Outfits
              </Button>
              <Button variant="secondary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Custom Outfit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Outfit Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Today's Suggestions</h3>
          <p className="text-muted-foreground">Fresh outfit ideas based on your wardrobe</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockOutfits.map((outfit) => (
            <Card 
              key={outfit.id} 
              className="group overflow-hidden hover:shadow-medium transition-all cursor-pointer"
            >
              <div className="bg-muted p-8">
                <div className="grid grid-cols-3 gap-4">
                  {outfit.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="aspect-square rounded-lg overflow-hidden bg-card shadow-soft group-hover:scale-105 transition-transform"
                    >
                      <img 
                        src={item} 
                        alt={`Item ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl font-semibold text-foreground mb-2">{outfit.name}</h4>
                <p className="text-muted-foreground text-sm mb-4">Perfect for a relaxed day out</p>
                <Button variant="outline" className="w-full">
                  Try This Outfit
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Outfit Builder Section */}
        <div className="mt-16 bg-card rounded-2xl p-12 shadow-soft text-center">
          <Sparkles className="w-16 h-16 mx-auto text-accent mb-6" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
            Build Your Own Outfit
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Use our drag-and-drop outfit builder to create your own unique combinations. Mix and match items from your closet to discover new styles.
          </p>
          <Button variant="accent" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Open Outfit Builder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Outfits;
