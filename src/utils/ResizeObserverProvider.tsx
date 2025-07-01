import React, { useEffect, useCallback } from 'react';

interface Props {
    children: React.ReactNode;
}

const ResizeObserverProvider: React.FC<Props> = ({ children }) => {
    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const handleResizeObserverError = useCallback((event: ErrorEvent) => {
        if (event.message?.includes('ResizeObserver') || event.message?.includes('Network Error')) {
            event.preventDefault();
            event.stopPropagation();

            // Masquer l'overlay d'erreur de webpack
            const overlayElements = [
                document.getElementById('webpack-dev-server-client-overlay'),
                document.getElementById('webpack-dev-server-client-overlay-div')
            ];

            overlayElements.forEach(element => {
                if (element) {
                    element.style.display = 'none';
                }
            });

            return false;
        }
    }, []);

    useEffect(() => {
        // Supprimer les erreurs de la console avec debounce
        const originalError = console.error;
        const debouncedConsoleError = debounce((...args: any[]) => {
            if (!args[0]?.includes?.('ResizeObserver') && !args[0]?.includes?.('Network Error')) {
                originalError.apply(console, args);
            }
        }, 100);

        console.error = debouncedConsoleError;

        // Gérer les erreurs avec debounce
        const debouncedErrorHandler = debounce(handleResizeObserverError, 100);
        window.addEventListener('error', debouncedErrorHandler as any);

        return () => {
            window.removeEventListener('error', debouncedErrorHandler as any);
            console.error = originalError;
        };
    }, [handleResizeObserverError]);

    return <>{children}</>;
};

export default ResizeObserverProvider;
