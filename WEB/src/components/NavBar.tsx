import { Button } from './Button.tsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, logout, getUserEmail } from '../utils/auth';
import { MapPinHouse, User } from 'lucide-react';

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
      <div className="flex justify-start items-center w-[33.33%] h-16">
        <div className="w-2" />
        <Button>
          <Link to="/" className="flex justify-center items-center">
            <MapPinHouse size={24} className="pl-2" />
            <div className="px-2">Locations</div>
          </Link>
        </Button>
      </div>
      <div className="flex justify-center w-[33.33%]"></div>
      <div className="flex justify-end items-center w-[33.33%] space-x-4 pr-4">
        {authenticated ? (
          <>
            <Button>
              <Link to="/user" className="flex justify-center items-center">
                <User size={24} className="pl-2" />
                <div className="px-2">{userEmail}</div>
              </Link>
            </Button>
            <Button onClick={handleLogout}>
              <div className="px-2">Logout</div>
            </Button>
          </>
        ) : (
          <>
            {location.pathname !== '/register' && (
              <Link to="/register">
                <Button>
                  <div className="px-2">Register</div>
                </Button>
              </Link>
            )}
            {location.pathname !== '/login' && (
              <Link to="/login">
                <Button>
                  <div className="px-2">Login</div>
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
