// http.js
const originalFetch = window.fetch;

window.fetch = async function (input, init = {}) {
  const token = localStorage.getItem('token');

  init.headers = {
    ...(init.headers || {}),
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await originalFetch(input, init);

  // 可选统一处理，比如 token 失效跳转
  if (response.status === 401) {
    window.location.href = '/admin/login';
  }

  return response;
};