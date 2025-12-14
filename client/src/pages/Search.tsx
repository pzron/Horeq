import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllProducts } from "@/lib/mockData";
import { ProductCard } from "./Home";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");
  const allProducts = getAllProducts(20);
  
  // Mock search filtering
  const results = query 
    ? allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : allProducts;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  className="pl-10 h-12 text-lg bg-background" 
                  placeholder="Search for anything..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <Button size="lg" className="h-12 px-8">Search</Button>
            </div>
            
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
              <span className="text-sm text-muted-foreground py-1">Popular:</span>
              {["Wireless Headphones", "Smart Watch", "Running Shoes", "Gaming Laptop"].map(term => (
                <button 
                  key={term}
                  onClick={() => setQuery(term)}
                  className="text-sm bg-background border px-3 py-1 rounded-full hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {query ? `Search results for "${query}"` : "All Products"} 
            <span className="text-muted-foreground text-lg font-normal ml-2">({results.length})</span>
          </h1>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-muted/50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground">Try checking your spelling or use different keywords.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
