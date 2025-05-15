// http.js
const originalFetch = window.fetch;

window.fetch = async function (input, init = {}) {
  const token = localStorage.getItem('token');

  const isFormData = init.body instanceof FormData;

  init.headers = {
    ...(init.headers || {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await originalFetch(input, init);

  if (response.status === 401) {
    console.warn('token 已失效，强制跳转登录');
    localStorage.removeItem('token'); // ✅ 删除 token
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 100); // 稍微延迟，避免被组件 render 冲掉
  }

  // 可选统一处理，比如 token 失效跳转
  if (response.status === 401) {
    window.location.href = '/admin/login';
  }

  return response;
};