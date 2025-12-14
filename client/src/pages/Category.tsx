import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";
import { CATEGORIES, getAllProducts } from "@/lib/mockData";
import { ProductCard } from "./Home";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:slug");
  const slug = params?.slug;
  const category = CATEGORIES.find(c => c.slug === slug);
  const products = getAllProducts(24); // Get more products for the category page

  if (!category && slug) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold">Category Not Found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Category Header */}
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-heading text-primary mb-2">
                {category?.name || "All Products"}
              </h1>
              <p className="text-muted-foreground">
                Showing {products.length} results for {category?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="w-full lg:w-64 shrink-0 hidden lg:block space-y-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Price Range</h4>
                  <Slider defaultValue={[50]} max={100} step={1} className="mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>$1000+</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Brands</h4>
                  <div className="space-y-2">
                    {['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas'].map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={`brand-${brand}`} />
                        <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">{brand}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(stars => (
                      <div key={stars} className="flex items-center space-x-2">
                        <Checkbox id={`star-${stars}`} />
                        <Label htmlFor={`star-${stars}`} className="text-sm font-normal flex items-center gap-1">
                          {stars}+ Stars
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Button className="w-full">Apply Filters</Button>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
               <Button variant="outline" size="lg" className="min-w-[200px]">Load More</Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
