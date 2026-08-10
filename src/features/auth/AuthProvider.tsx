import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from './authApi';
import { setUser, logout, setLoading } from './authSlice';
import type { RootState } from '@/store';
import { LoadingState } from '@/components/common/StateComponents';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  // Always use the query, but only fetch if we have a token
  const { data, error, isLoading: isQueryLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      // If no token exists at all, we are not loading auth state
      dispatch(setLoading(false));
      return;
    }

    if (data?.success && data.data) {
      dispatch(setUser(data.data));
    } else if (error) {
      dispatch(logout()); // Token is invalid/expired
    }
  }, [token, data, error, dispatch]);

  // Optionally show a full screen loader while verifying the initial token
  if (token && isQueryLoading && isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <LoadingState message="Verifying session..." />
      </div>
    );
  }

  return <>{children}</>;
}
