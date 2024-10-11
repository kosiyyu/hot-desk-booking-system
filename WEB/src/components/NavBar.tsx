import { Button } from './Button.tsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, logout, isAdmin, getUserEmail } from '../utils/auth';

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  const userEmail = getUserEmail();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full flex flex-row border">
      <div className="flex justify-start items-center w-[33.33%]">
        <img
          src={'uncommend logoPath'}
          className="h-12 w-auto m-2"
          alt="Logo"
        />
      </div>
      <div className="flex justify-center w-[33.33%]"></div>
      <div className="flex justify-end items-center w-[33.33%] space-x-4 pr-4">
        {authenticated ? (
          <>
            <Link to="/user" className="text-sm font-medium hover:underline">
              {userEmail}
            </Link>
            {isAdmin() && (
              <Link to="/admin">
                <Button>Admin Panel</Button>
              </Link>
            )}
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            {location.pathname !== '/register' && (
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            )}
            {location.pathname !== '/login' && (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
