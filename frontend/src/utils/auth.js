export const saveAuth = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  export const getUser = () => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  };
  
  export const isLoggedIn = () => !!localStorage.getItem('token');
  