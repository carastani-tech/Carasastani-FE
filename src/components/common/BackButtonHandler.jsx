import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButtonHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let backButtonListener;

        const setupListener = async () => {
            backButtonListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
                if (location.pathname === '/' || location.pathname === '/home') {
                    // If on home page, exit app
                    CapacitorApp.exitApp();
                } else {
                    // Otherwise go back in history
                    navigate(-1);
                }
            });
        };

        setupListener();

        return () => {
            if (backButtonListener) {
                backButtonListener.remove();
            }
        };
    }, [navigate, location]);

    return null;
};

export default BackButtonHandler;
