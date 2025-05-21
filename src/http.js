// http.js
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
const originalFetch = window.fetch;

window.fetch = async function (input, init = {}) {
  const token = localStorage.getItem('token');
  console.log('HTTP fetch token:', token);  // Debug token output

  const isFormData = init.body instanceof FormData;

  init.headers = {
    ...(init.headers || {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  console.log('HTTP fetch headers:', init.headers);  // Debug headers output

  const url = typeof input === 'string' && input.startsWith('/') ? baseUrl + input : input;
  const response = await originalFetch(url, init);

  if (response.status === 401) {
    console.warn('token 已失效');
    localStorage.removeItem('token');
    if (window.location.pathname !== '/admin/login') {
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 100);
    }
  }

  return response;
};

export default window.fetch;