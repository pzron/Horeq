import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "customer" | "affiliate" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isAffiliate?: boolean;
  affiliateCode?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "horeq_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string, role: UserRole = "customer"): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUsers: Record<string, User> = {
      "admin@horeq.com": {
        id: "admin-1",
        name: "Admin User",
        email: "admin@horeq.com",
        phone: "+880 1700-000000",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      },
      "affiliate@horeq.com": {
        id: "affiliate-1",
        name: "Affiliate Partner",
        email: "affiliate@horeq.com",
        phone: "+880 1800-000000",
        role: "affiliate",
        isAffiliate: true,
        affiliateCode: "AFF2024",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
    };

    const existingUser = mockUsers[email];
    if (existingUser && existingUser.role === role) {
      setUser(existingUser);
      return true;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0],
      email,
      phone: "+880 1712-345678",
      role,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    };
    setUser(newUser);
    return true;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "customer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
