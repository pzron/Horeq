import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/mockData";
import { ProductCard } from "./Home";
import { Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Deals() {
  const flashDeals = getAllProducts(12).map(p => ({
    ...p,
    originalPrice: p.price * 1.5, // Fake original price for deals
    price: p.price * 0.7, // Discounted price
    isSale: true
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="bg-destructive text-destructive-foreground py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-white text-destructive mb-4 hover:bg-white text-lg px-4 py-1">Flash Sale Live</Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
              MEGA <span className="text-yellow-300">DEALS</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Up to 80% off on top brands. Hurry, offers end soon!
            </p>
            
            <div className="flex justify-center gap-4 text-2xl font-mono font-bold">
              <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
                02 <span className="text-xs font-sans font-normal block">Hours</span>
              </div>
              <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
                45 <span className="text-xs font-sans font-normal block">Mins</span>
              </div>
              <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-lg border border-white/20 text-yellow-300 animate-pulse">
                12 <span className="text-xs font-sans font-normal block text-white">Secs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="h-8 w-8 text-yellow-500 fill-yellow-500 animate-bounce" />
          <h2 className="text-3xl font-bold font-heading">Lightning Deals</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals.map((product) => (
            <div key={product.id} className="relative">
              <div className="absolute -top-3 -right-3 z-10 bg-yellow-400 text-black font-bold h-12 w-12 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                -30%
              </div>
              <ProductCard product={product} />
              <div className="mt-2">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-destructive w-[85%] rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Sold: 85%</span>
                  <span className="text-destructive font-medium">Almost Gone!</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
