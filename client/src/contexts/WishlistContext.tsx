import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/mockData";

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "horeq_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems((currentItems) => {
      if (currentItems.find((item) => item.id === product.id)) {
        return currentItems;
      }
      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
