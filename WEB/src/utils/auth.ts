import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5106/api';

interface UserDTO {
  email: string;
  password: string;
  username: string;
}

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  jti: string;
  username: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/user/validate`, {
      email,
      password,
    } as UserDTO);
    const token = response.data;
    setToken(token);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// export const isTokenExpired = (token: string) => {
//   const payload = decodeToken(token);
//   return payload ? payload.exp * 1000 < Date.now() : true;
// };

interface ExtendedJWTPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  exp?: number;
  sub?: string;
  // Add other properties if needed
}

export const isAdmin = (): boolean => {
  const token = getToken();
  if (!token) return false;

  const payload: ExtendedJWTPayload | null = decodeToken(token);

  console.log('isAdmin token:', payload); // Log the entire payload
  console.log('Payload keys:', payload ? Object.keys(payload) : []); // Log the keys of the payload

  const roleClaim =
    payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  console.log('Role claim:', roleClaim); // Log the role claim

  return roleClaim === 'Admin';
};

export const isTokenExpired = (token: string) => {
  const payload: ExtendedJWTPayload | null = decodeToken(token);
  return payload ? payload.exp! * 1000 < Date.now() : true;
};

export const getUserId = (): number | null => {
  const token = getToken();
  if (!token) return null;

  const payload: ExtendedJWTPayload | null = decodeToken(token);
  return payload ? Number.parseInt(payload.sub!) : null;
};

export const getUserEmail = (): string | null => {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  return payload ? payload.email : null;
};

export const getUsername = (): string | null => {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  return payload ? payload.username : null;
};

export const getTokenExpiration = (): Date | null => {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  return payload ? new Date(payload.exp * 1000) : null;
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
};
