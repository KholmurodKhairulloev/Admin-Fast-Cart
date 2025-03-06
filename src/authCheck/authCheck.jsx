import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children }) => {
    const router = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            router('/login');
            return;
        }

        try {

            const decoded = jwtDecode(token);
            console.log('Decoded token:', decoded);


            if (decoded.name !== 'SuperAdmin') {
                router('/login');
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            router('/');
        }   
    }, [router]);

    return <div>{children}</div>;
};

export default AuthCheck;