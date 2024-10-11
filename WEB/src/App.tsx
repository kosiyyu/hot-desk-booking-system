import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { NavBar } from './components/NavBar';
import Footer from './components/Footer';
import Locations from './pages/Locations';
import Location from './pages/Location';
import Login from './pages/Login';
import Register from './pages/Register';
import User from './pages/User';
import { isAuthenticated, setupAxiosInterceptors } from './utils/auth';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <NavBar />
        <div className="container mx-auto flex-grow p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Locations />
                </PrivateRoute>
              }
            />
            <Route
              path="/location/:id"
              element={
                <PrivateRoute>
                  <Location />
                </PrivateRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute>
                  <User />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
