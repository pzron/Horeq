import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllProducts, Product } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Plus, Minus, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Pre-set Combos
const FEATURED_COMBOS = [
  {
    id: 'c1',
    name: "Summer Essentials Pack",
    price: 1500,
    originalPrice: 2200,
    items: ["Cotton T-Shirt", "Sunglasses", "Water Bottle"],
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    color: "bg-orange-100 text-orange-800"
  },
  {
    id: 'c2',
    name: "Tech Starter Kit",
    price: 2500,
    originalPrice: 3500,
    items: ["Wireless Mouse", "Mousepad", "USB Hub"],
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: 'c3',
    name: "Home Office Bundle",
    price: 4500,
    originalPrice: 5500,
    items: ["Desk Lamp", "Organizer", "Notebook"],
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    color: "bg-green-100 text-green-800"
  }
];

export default function ComboPage() {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const allProducts = getAllProducts(20);

  const toggleProduct = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const totalAmount = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const MINIMUM_AMOUNT = 1100;
  const isValid = totalAmount >= MINIMUM_AMOUNT;

  const handleCreateCombo = () => {
    if (!isValid) {
      toast({
        title: "Minimum Amount Not Met",
        description: `Your combo needs to be at least ${MINIMUM_AMOUNT} Taka. Add ${Math.ceil(MINIMUM_AMOUNT - totalAmount)} Taka more.`,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Combo Created!",
      description: `Successfully created a custom combo worth ${totalAmount.toFixed(2)} Taka. Added to cart.`,
      className: "bg-green-500 text-white border-none",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary/5 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4 bg-accent text-white hover:bg-accent/90">Save More With Combos</Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 text-primary">
            Super Saver <span className="text-accent">Combos</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Choose from our curated value packs or build your own custom bundle to save big. 
            Minimum order value for custom combos: <span className="font-bold text-foreground">1100 Taka</span>.
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 space-y-20">
        
        {/* Pre-set Combos */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-1 bg-accent rounded-full"></div>
            <h2 className="text-2xl font-bold font-heading">Hot Deals of the Week</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_COMBOS.map((combo) => (
              <Card key={combo.id} className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img 
                    src={combo.image} 
                    alt={combo.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <Badge className="bg-accent text-white border-none mb-2">Save {(combo.originalPrice - combo.price)} Tk</Badge>
                    <h3 className="font-bold text-xl">{combo.name}</h3>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <ul className="space-y-2 mb-6">
                    {combo.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500" /> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground line-through block">Tk {combo.originalPrice}</span>
                      <span className="text-2xl font-bold text-primary">Tk {combo.price}</span>
                    </div>
                    <Button className="rounded-full px-6">Buy Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Build Your Own Combo */}
        <section className="bg-card border rounded-3xl p-6 md:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            {/* Left: Product Selection */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-heading mb-2">Build Your Own Combo</h2>
                <p className="text-muted-foreground">Select products to create your custom package. Minimum value required: 1100 Tk.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {allProducts.map((product) => {
                  const isSelected = selectedProducts.some(p => p.id === product.id);
                  return (
                    <div 
                      key={product.id} 
                      onClick={() => toggleProduct(product)}
                      className={`
                        cursor-pointer rounded-xl border p-3 transition-all duration-200 relative group
                        ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50 bg-background'}
                      `}
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <div className={`
                          h-5 w-5 rounded-full border flex items-center justify-center transition-colors
                          ${isSelected ? 'bg-primary border-primary text-white' : 'bg-white border-muted-foreground/30'}
                        `}>
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                      
                      <div className="aspect-square rounded-lg bg-muted mb-3 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <h4 className="font-medium text-sm line-clamp-1 mb-1">{product.name}</h4>
                      <p className="font-bold text-primary text-sm">Tk {product.price}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Summary Card */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="sticky top-24">
                <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
                  <div className="bg-primary/5 p-4 border-b border-primary/10">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" /> Your Combo
                    </h3>
                  </div>
                  
                  <CardContent className="p-6">
                    {selectedProducts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                          <Plus className="h-6 w-6 opacity-50" />
                        </div>
                        <p>Select products from the list to start building your combo</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {selectedProducts.map(p => (
                            <div key={p.id} className="flex justify-between items-center text-sm">
                              <span className="line-clamp-1 flex-1 text-muted-foreground">{p.name}</span>
                              <span className="font-medium ml-2">Tk {p.price}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleProduct(p); }}
                                className="ml-2 text-muted-foreground hover:text-destructive"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="h-px bg-border my-4"></div>
                        
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total Value</span>
                          <span>Tk {totalAmount.toFixed(2)}</span>
                        </div>

                        {/* Progress Bar for Minimum Amount */}
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className={isValid ? "text-green-600" : "text-muted-foreground"}>
                              Progress to Valid Combo
                            </span>
                            <span>{Math.min(100, (totalAmount / MINIMUM_AMOUNT) * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${isValid ? 'bg-green-500' : 'bg-orange-400'}`}
                              style={{ width: `${Math.min(100, (totalAmount / MINIMUM_AMOUNT) * 100)}%` }}
                            ></div>
                          </div>
                          {!isValid && (
                            <p className="text-xs text-orange-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Add Tk {(MINIMUM_AMOUNT - totalAmount).toFixed(0)} more to qualify
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="p-4 bg-muted/30">
                    <Button 
                      className={`w-full h-12 text-base font-bold transition-all ${isValid ? 'bg-primary hover:bg-primary/90' : 'bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/20'}`}
                      disabled={!isValid}
                      onClick={handleCreateCombo}
                    >
                      {isValid ? 'Add Combo to Cart' : `Min. Order Tk ${MINIMUM_AMOUNT}`}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
