import axios from 'axios';

const rawApiUrl = (process.env.REACT_APP_API_URL || '').trim().replace(/\/$/, '');
const API = axios.create({
  baseURL: rawApiUrl ? `${rawApiUrl.replace(/\/api$/, '')}/api` : '/api',
});

// Attach token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('bh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/update', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// Listings
export const getListings = (params) => API.get('/listings', { params });
export const getListing = (id) => API.get(`/listings/${id}`);
export const createListing = (data) => API.post('/listings', data); // FormData
export const updateListing = (id, data) => API.put(`/listings/${id}`, data);
export const deleteListing = (id) => API.delete(`/listings/${id}`);
export const getMyListings = () => API.get('/listings/my');
export const getStats = () => API.get('/listings/stats');

// Categories & Locations
export const getCategories = () => API.get('/categories');
export const getLocations = () => API.get('/categories/locations');

export default API;
