import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://fg-express.onrender.com',  // Buraya backend URL'in
  withCredentials: true,             // Eğer cookie kullanıyorsan
});
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403 && error.response?.data?.message === 'Hesabınız banlandı.') {
      localStorage.removeItem('token');
      window.location.href = '/login'; // veya logout route
    }
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => response, // başarılıysa aynen döndür
  error => {
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname.startsWith('/admin')
    ) {
      // Token geçersizse veya admin veritabanından silindiyse:
      localStorage.removeItem('admin_token'); // Token'ı temizle
      window.location.href = '/admin/login';  // Giriş sayfasına yönlendir
    }

    return Promise.reject(error);
  }
);

export default instance;
