import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const PrivateRoute = ({ component: Component }) => {
    const token = getToken(); // LocalStorage'dan Token'ı alıyoruz.

    // Eğer token yoksa, login sayfasına yönlendir
    return token ? <Component /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;