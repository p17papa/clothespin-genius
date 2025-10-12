import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Shirt, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const mockItems = [
  { id: 1, category: "tops", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400", name: "White Shirt" },
  { id: 2, category: "tops", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400", name: "Black T-Shirt" },
  { id: 3, category: "bottoms", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", name: "Blue Jeans" },
  { id: 4, category: "bottoms", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400", name: "Black Pants" },
  { id: 5, category: "shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400", name: "White Sneakers" },
  { id: 6, category: "shoes", image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400", name: "Brown Boots" },
  { id: 7, category: "accessories", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400", name: "Watch" },
  { id: 8, category: "accessories", image: "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=400", name: "Sunglasses" },
];

const Closet = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = selectedCategory === "all" 
    ? mockItems 
    : mockItems.filter(item => item.category === selectedCategory);

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
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">My Closet</h2>
              <p className="text-muted-foreground">Organize and browse your wardrobe</p>
            </div>
            <Button variant="accent" size="lg">
              <Upload className="w-5 h-5 mr-2" />
              Upload Items
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
          <TabsList className="mb-8 bg-card border border-border shadow-soft">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-accent data-[state=active]:text-accent-foreground">
              All Items
            </TabsTrigger>
            <TabsTrigger value="tops" className="data-[state=active]:bg-gradient-accent data-[state=active]:text-accent-foreground">
              Tops
            </TabsTrigger>
            <TabsTrigger value="bottoms" className="data-[state=active]:bg-gradient-accent data-[state=active]:text-accent-foreground">
              Bottoms
            </TabsTrigger>
            <TabsTrigger value="shoes" className="data-[state=active]:bg-gradient-accent data-[state=active]:text-accent-foreground">
              Shoes
            </TabsTrigger>
            <TabsTrigger value="accessories" className="data-[state=active]:bg-gradient-accent data-[state=active]:text-accent-foreground">
              Accessories
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            {filteredItems.length === 0 ? (
              <Card className="p-12 text-center">
                <Shirt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No items yet</h3>
                <p className="text-muted-foreground mb-6">Start building your digital wardrobe</p>
                <Button variant="accent">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First Item
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="group overflow-hidden cursor-pointer hover:shadow-medium transition-all hover:scale-[1.02]"
                  >
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Closet;
