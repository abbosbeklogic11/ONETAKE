export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// Helper to get raw base URL for assets if needed
export const BASE_URL = API_URL.replace('/api', '');
