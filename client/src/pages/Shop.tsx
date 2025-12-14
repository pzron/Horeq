import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CATEGORIES, getAllProducts, Product } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Grid3x3, LayoutGrid, Star, Heart, ShoppingCart, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

function ProductCard({ product, viewMode }: { product: Product; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Card className="flex flex-col sm:flex-row overflow-hidden group" data-testid={`card-product-${product.id}`}>
        <Link href={`/product/${product.id}`} className="relative w-full sm:w-48 aspect-square sm:aspect-auto sm:h-48 shrink-0 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {product.isSale && <Badge className="absolute top-2 left-2 bg-destructive">Sale</Badge>}
          {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
        </Link>
        <div className="flex-1 p-4 flex flex-col">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold hover:text-primary transition-colors mb-2">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-lg font-bold text-primary">${product.price}</span>
            {product.originalPrice && <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>}
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="flex-1 gap-1" data-testid={`button-add-cart-${product.id}`}>
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <Button size="icon" variant="outline" data-testid={`button-wishlist-${product.id}`}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group flex flex-col h-full" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.isSale && <Badge className="absolute top-2 left-2 bg-destructive">Sale</Badge>}
        {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
        <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`button-wishlist-${product.id}`}>
          <Heart className="h-4 w-4" />
        </Button>
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors mb-2 flex-1">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
          ))}
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-primary">${product.price}</span>
            {product.originalPrice && <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>}
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" data-testid={`button-add-cart-${product.id}`}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function FilterPanel({ selectedCategories, setSelectedCategories, priceRange, setPriceRange, selectedRatings, setSelectedRatings }: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedRatings: number[];
  setSelectedRatings: (ratings: number[]) => void;
}) {
  const toggleCategory = (slug: string) => {
    setSelectedCategories(
      selectedCategories.includes(slug)
        ? selectedCategories.filter(c => c !== slug)
        : [...selectedCategories, slug]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings(
      selectedRatings.includes(rating)
        ? selectedRatings.filter(r => r !== rating)
        : [...selectedRatings, rating]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </h4>
      </div>

      <div>
        <h5 className="text-sm font-medium mb-3">Price Range</h5>
        <Slider value={priceRange} onValueChange={setPriceRange} max={1500} step={10} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1] || 1500}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h5 className="text-sm font-medium mb-3">Categories</h5>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {CATEGORIES.slice(0, 15).map(cat => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${cat.slug}`} 
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <Label htmlFor={`cat-${cat.slug}`} className="text-sm font-normal cursor-pointer flex-1">
                {cat.name}
              </Label>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h5 className="text-sm font-medium mb-3">Rating</h5>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox 
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => toggleRating(rating)}
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm font-normal cursor-pointer flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < rating ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
                ))}
                <span className="ml-1">& Up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h5 className="text-sm font-medium mb-3">Availability</h5>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" defaultChecked />
            <Label htmlFor="in-stock" className="text-sm font-normal">In Stock</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="on-sale" />
            <Label htmlFor="on-sale" className="text-sm font-normal">On Sale</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="new-arrivals" />
            <Label htmlFor="new-arrivals" className="text-sm font-normal">New Arrivals</Label>
          </div>
        </div>
      </div>

      <Button className="w-full" data-testid="button-apply-filters">Apply Filters</Button>
      <Button variant="outline" className="w-full" onClick={() => {
        setSelectedCategories([]);
        setPriceRange([0, 1500]);
        setSelectedRatings([]);
      }} data-testid="button-clear-filters">Clear All</Button>
    </div>
  );
}

export default function Shop() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const allProducts = getAllProducts(48);
  
  const filteredProducts = allProducts.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategories.length > 0 && !selectedCategories.some(cat => product.category.toLowerCase().includes(cat.replace('-', ' ')))) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedRatings.length > 0 && !selectedRatings.some(r => product.rating >= r)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default: return 0;
    }
  });

  const activeFiltersCount = selectedCategories.length + selectedRatings.length + (priceRange[0] > 0 || priceRange[1] < 1500 ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="bg-primary/5 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold font-heading text-primary mb-2">All Products</h1>
          <p className="text-muted-foreground">Showing {sortedProducts.length} products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <FilterPanel 
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedRatings={selectedRatings}
                setSelectedRatings={setSelectedRatings}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-2" data-testid="button-mobile-filters">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] overflow-y-auto">
                    <FilterPanel 
                      selectedCategories={selectedCategories}
                      setSelectedCategories={setSelectedCategories}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      selectedRatings={selectedRatings}
                      setSelectedRatings={setSelectedRatings}
                    />
                  </SheetContent>
                </Sheet>

                <Input 
                  placeholder="Search in results..." 
                  className="w-40 sm:w-56 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-results"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36 h-9" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex border rounded-md">
                  <Button 
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-9 w-9 rounded-r-none"
                    onClick={() => setViewMode('grid')}
                    data-testid="button-view-grid"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-9 w-9 rounded-l-none"
                    onClick={() => setViewMode('list')}
                    data-testid="button-view-list"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map(cat => (
                  <Badge key={cat} variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}>
                    {cat} <X className="h-3 w-3" />
                  </Badge>
                ))}
                {selectedRatings.map(r => (
                  <Badge key={r} variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSelectedRatings(selectedRatings.filter(rating => rating !== r))}>
                    {r}+ Stars <X className="h-3 w-3" />
                  </Badge>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 1500) && (
                  <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setPriceRange([0, 1500])}>
                    ${priceRange[0]} - ${priceRange[1]} <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {sortedProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" 
                : "flex flex-col gap-4"
              }>
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No products found matching your filters.</p>
                <Button variant="outline" onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([0, 1500]);
                  setSelectedRatings([]);
                  setSearchQuery('');
                }}>Clear All Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {sortedProducts.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="secondary">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
