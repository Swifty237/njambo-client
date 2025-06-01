import { useEffect, useState } from "react";

const useResponsive = () => {
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        aspectRatio: window.innerWidth / window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
                aspectRatio: window.innerWidth / window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        ...screenSize,
        isMobile: screenSize.width <= 390,
        isMobileLarge: screenSize.width > 390 && screenSize.width <= 768,
        isTablet: screenSize.width > 768 && screenSize.width <= 1024,
        isDesktop: screenSize.width > 1024 && screenSize.width <= 1440,
        isDesktopLarge: screenSize.width > 1440,
        isUltraWide: screenSize.aspectRatio > 2.1
    };
};

export default useResponsive;