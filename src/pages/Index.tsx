import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload, Shirt, Wand2, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-wardrobe.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [currentOutfit, setCurrentOutfit] = useState<{ top?: string; bottom?: string }>({});
  const [hasWardrobe, setHasWardrobe] = useState(false);

  useEffect(() => {
    const avatar = localStorage.getItem('avatarImage');
    const savedTops = localStorage.getItem('tops');
    const savedBottoms = localStorage.getItem('bottoms');
    
    if (avatar && savedTops && savedBottoms) {
      setAvatarImage(avatar);
      const tops = JSON.parse(savedTops);
      const bottoms = JSON.parse(savedBottoms);
      setHasWardrobe(tops.length > 0 && bottoms.length > 0);
      
      if (tops.length > 0 && bottoms.length > 0) {
        setCurrentOutfit({
          top: tops[0],
          bottom: bottoms[0],
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="font-serif text-2xl font-bold text-foreground">Ntoulapa</h1>
            <div className="flex items-center gap-4">
              <Link to="/setup">
                <Button variant="ghost">
                  <Settings className="w-4 h-4 mr-2" />
                  Wardrobe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Shows avatar if available */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          {hasWardrobe && avatarImage ? (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
                  Your Virtual Closet
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ready to try on some outfits?
                </p>
              </div>

              {/* Avatar Preview with Current Outfit */}
              <div className="relative mb-8">
                <div className="aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-strong bg-muted relative">
                  <img 
                    src={avatarImage} 
                    alt="Your avatar" 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Current outfit overlay */}
                  <div className="absolute inset-0">
                    {currentOutfit.top && (
                      <div className="absolute left-1/2 -translate-x-1/2 w-[70%] top-[15%]" style={{ maxHeight: '35%' }}>
                        <img 
                          src={currentOutfit.top} 
                          alt="Top" 
                          className="w-full h-auto object-contain drop-shadow-lg" 
                        />
                      </div>
                    )}
                    
                    {currentOutfit.bottom && (
                      <div className="absolute left-1/2 -translate-x-1/2 w-[65%] top-[48%]" style={{ maxHeight: '40%' }}>
                        <img 
                          src={currentOutfit.bottom} 
                          alt="Bottom" 
                          className="w-full h-auto object-contain drop-shadow-lg" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Link to="/stylist" className="flex-1">
                  <Button variant="hero" size="lg" className="w-full">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Try On Clothes
                  </Button>
                </Link>
                <Link to="/setup" className="flex-1">
                  <Button variant="secondary" size="lg" className="w-full">
                    <Shirt className="w-5 h-5 mr-2" />
                    Manage Wardrobe
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm font-medium text-accent-foreground">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Styling
                </div>
                <h2 className="font-serif text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Never Say "I Have Nothing to Wear" Again
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Transform your closet chaos into stylish confidence. Ntoulapa organizes your wardrobe digitally and delivers personalized outfit recommendations powered by AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/setup">
                    <Button variant="hero" size="lg">
                      Start Your Closet
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-strong">
                  <img 
                    src={heroImage} 
                    alt="Elegant wardrobe organization" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-accent rounded-full blur-3xl opacity-30" />
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-hero rounded-full blur-3xl opacity-20" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Your Personal AI Stylist
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to unlock your wardrobe's full potential
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all">
              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-6">
                <Upload className="w-7 h-7 text-accent-foreground" />
              </div>
              <h4 className="font-serif text-xl font-semibold text-card-foreground mb-3">
                Upload & Organize
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Snap photos of your clothes. Our AI automatically removes backgrounds and categorizes everything into tops, bottoms, shoes, and accessories.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all">
              <div className="w-14 h-14 bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                <Shirt className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="font-serif text-xl font-semibold text-card-foreground mb-3">
                Browse Your Closet
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                View your entire wardrobe in one place. Filter by category, color, or season to find exactly what you're looking for.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all">
              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-6">
                <Wand2 className="w-7 h-7 text-accent-foreground" />
              </div>
              <h4 className="font-serif text-xl font-semibold text-card-foreground mb-3">
                Get AI Suggestions
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Receive personalized outfit combinations based on your style, occasion, and weather. Mix and match with our drag-and-drop builder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Wardrobe?
          </h3>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands who've already discovered their perfect style with Ntoulapa's AI-powered wardrobe assistant.
          </p>
          <Link to="/setup">
            <Button variant="accent" size="lg" className="text-lg px-10">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
