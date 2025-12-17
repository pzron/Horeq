import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Tag, Package, ArrowRight, ShoppingBag } from "lucide-react";
import type { Brand, VendorStore, Product } from "@shared/schema";

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/brands/${brand.slug}`}>
      <Card className="hover-elevate cursor-pointer h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          {brand.logo ? (
            <img src={brand.logo} alt={brand.name} className="h-16 w-16 object-contain mb-4" />
          ) : (
            <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center mb-4">
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <h3 className="font-semibold mb-1" data-testid={`text-brand-name-${brand.id}`}>{brand.name}</h3>
          {brand.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{brand.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function VendorStoreCard({ store }: { store: VendorStore }) {
  return (
    <Link href={`/store/${store.slug}`}>
      <Card className="hover-elevate cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {store.logo ? (
              <img src={store.logo} alt={store.storeName} className="h-16 w-16 object-contain rounded-lg" />
            ) : (
              <div className="h-16 w-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                <Store className="h-8 w-8 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1" data-testid={`text-store-name-${store.id}`}>{store.storeName}</h3>
              {store.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{store.description}</p>
              )}
              <div className="flex items-center gap-2">
                {store.isVerified && <Badge variant="outline" className="text-xs">Verified</Badge>}
                {store.city && <span className="text-xs text-muted-foreground">{store.city}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="hover-elevate cursor-pointer overflow-hidden">
        <div className="aspect-square bg-muted relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              Sale
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">${product.price}</span>
            {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Brands() {
  const { data: brands = [], isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const { data: vendorStores = [], isLoading: storesLoading } = useQuery<VendorStore[]>({
    queryKey: ["/api/vendor-stores"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
          <div className="container">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-heading mb-2">Brands & Stores</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Discover premium brands and trusted vendor stores on our marketplace.
              </p>
            </div>

            <Tabs defaultValue="brands" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="brands" data-testid="tab-brands">
                  <Tag className="h-4 w-4 mr-2" /> Brands
                </TabsTrigger>
                <TabsTrigger value="stores" data-testid="tab-stores">
                  <Store className="h-4 w-4 mr-2" /> Vendor Stores
                </TabsTrigger>
              </TabsList>

              <TabsContent value="brands">
                {brandsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : brands.length === 0 ? (
                  <Card className="text-center py-12">
                    <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Brands Yet</h3>
                    <p className="text-muted-foreground">Check back soon for featured brands.</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {brands.filter(b => b.isActive).map((brand) => (
                      <BrandCard key={brand.id} brand={brand} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stores">
                {storesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : vendorStores.length === 0 ? (
                  <Card className="text-center py-12">
                    <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Vendor Stores Yet</h3>
                    <p className="text-muted-foreground mb-4">Be the first to open a store!</p>
                    <Link href="/sweet/vendor">
                      <Button>
                        Become a Vendor <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendorStores.map((store) => (
                      <VendorStoreCard key={store.id} store={store} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function BrandDetail() {
  const { slug } = useParams();
  
  const { data: brand, isLoading: brandLoading } = useQuery<Brand>({
    queryKey: ["/api/brands", slug],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/brands", slug, "products"],
    enabled: !!slug,
  });

  if (brandLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="text-center p-8">
            <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Brand Not Found</h2>
            <Link href="/brands">
              <Button variant="outline">Back to Brands</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
          <div className="container">
            <div className="flex items-center gap-6 mb-8">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-24 w-24 object-contain rounded-lg border" />
              ) : (
                <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center">
                  <Tag className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold font-heading mb-2">{brand.name}</h1>
                {brand.description && (
                  <p className="text-muted-foreground max-w-2xl">{brand.description}</p>
                )}
                {brand.website && (
                  <a 
                    href={brand.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Products from {brand.name}</h2>
            
            {productsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : products.length === 0 ? (
              <Card className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
                <p className="text-muted-foreground">This brand has no products listed.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.filter(p => p.isPublished).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function VendorStorePage() {
  const { slug } = useParams();
  
  const { data: store, isLoading: storeLoading } = useQuery<VendorStore>({
    queryKey: ["/api/vendor-stores", slug],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/vendor-stores", slug, "products"],
    enabled: !!slug,
  });

  if (storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="text-center p-8">
            <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Store Not Found</h2>
            <Link href="/brands">
              <Button variant="outline">Back to Stores</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {store.banner && (
          <div className="h-48 md:h-64 bg-muted relative">
            <img src={store.banner} alt={store.storeName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}
        
        <div className="container py-8">
          <div className="flex items-start gap-6 mb-8">
            {store.logo ? (
              <img 
                src={store.logo} 
                alt={store.storeName} 
                className={`h-24 w-24 object-contain rounded-lg border bg-background ${store.banner ? '-mt-16' : ''}`}
              />
            ) : (
              <div className={`h-24 w-24 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center ${store.banner ? '-mt-16' : ''}`}>
                <Store className="h-12 w-12 text-white" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold font-heading">{store.storeName}</h1>
                {store.isVerified && <Badge>Verified</Badge>}
              </div>
              {store.description && (
                <p className="text-muted-foreground mb-3">{store.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {store.city && <span>{store.city}{store.country ? `, ${store.country}` : ""}</span>}
                {store.phone && <span>{store.phone}</span>}
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">Products</h2>
          
          {productsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <Card className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
              <p className="text-muted-foreground">This store has no products listed yet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
