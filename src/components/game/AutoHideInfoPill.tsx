import React, { useState, useEffect } from 'react';
import { InfoPill } from './InfoPill';

interface AutoHideInfoPillProps {
    children: React.ReactNode;
    autoHide?: boolean;
    hideDelay?: number;
}

export const AutoHideInfoPill: React.FC<AutoHideInfoPillProps> = ({
    children,
    autoHide = false,
    hideDelay = 3000
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoHide) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, hideDelay);

            return () => clearTimeout(timer);
        }
    }, [autoHide, hideDelay, children]); // Re-run when children changes

    // Reset visibility when content changes
    useEffect(() => {
        if (autoHide) {
            setIsVisible(true);
        }
    }, [children, autoHide]);

    if (!isVisible) {
        return null;
    }

    return <InfoPill>{children}</InfoPill>;
};
