import { useNavigate } from 'react-router-dom';
import { useUser } from '../features/authentication/useUser';
import Spinner from './Spinner';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // 1. Load the authenticated user
  const { isLoading, isAuthenticated, fetchStatus } = useUser();

  // 2. If there is No authenticated user, redirect to the /login
  useEffect(() => {
    if (!isAuthenticated && !isLoading && fetchStatus !== 'fetching')
      navigate('/login');
  }, [isAuthenticated, isLoading, navigate, fetchStatus]);

  // 3. While loading, show a spinner
  if (isLoading)
    return (
      <div className="bg-grey-50 flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  // 4. If there IS a user, render the app
  if (isAuthenticated) return children;
}
