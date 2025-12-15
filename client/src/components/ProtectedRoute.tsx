import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  requireApprovedAffiliate?: boolean;
  redirectTo?: string;
}

interface AffiliateStatus {
  status: "pending" | "approved" | "rejected";
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireApprovedAffiliate = false,
  redirectTo = "/auth",
}: ProtectedRouteProps) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [affiliateStatus, setAffiliateStatus] = useState<AffiliateStatus | null>(null);
  const [checkingAffiliate, setCheckingAffiliate] = useState(requireApprovedAffiliate);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      setLocation(redirectTo);
    }
  }, [isLoading, isLoggedIn, setLocation, redirectTo]);

  useEffect(() => {
    const checkAffiliateStatus = async () => {
      if (!requireApprovedAffiliate || !user || user.role !== "affiliate") {
        setCheckingAffiliate(false);
        return;
      }

      try {
        const response = await fetch(`/api/affiliates/user/${user.id}`, {
          credentials: "include",
        });
        if (response.ok) {
          const affiliate = await response.json();
          setAffiliateStatus({ status: affiliate.status });
        }
      } catch (error) {
        console.error("Failed to check affiliate status:", error);
      } finally {
        setCheckingAffiliate(false);
      }
    };

    if (user && requireApprovedAffiliate) {
      checkAffiliateStatus();
    }
  }, [user, requireApprovedAffiliate]);

  if (isLoading || checkingAffiliate) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="loading-protected-route">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user || !roles.includes(user.role)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4" data-testid="access-denied">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      );
    }
  }

  if (requireApprovedAffiliate && user?.role === "affiliate") {
    if (affiliateStatus?.status === "pending") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4" data-testid="affiliate-pending">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-2">Application Pending</h1>
            <p className="text-muted-foreground">
              Your affiliate application is currently under review. You'll receive access to the full dashboard once approved.
            </p>
          </div>
        </div>
      );
    }
    if (affiliateStatus?.status === "rejected") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4" data-testid="affiliate-rejected">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-2">Application Rejected</h1>
            <p className="text-muted-foreground">
              Unfortunately, your affiliate application was not approved. Please contact support for more information.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
