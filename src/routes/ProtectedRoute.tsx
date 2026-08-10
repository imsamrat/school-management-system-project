import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { LoadingState } from '@/components/common/StateComponents';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
}

export default function ProtectedRoute({ children, permission }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermission();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingState message="Loading your workspace..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-lg font-semibold text-gray-900">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1">
          You do not have permission to access this page.
        </p>
        <button onClick={() => window.history.back()} className="btn-secondary mt-4">
          Go back
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
