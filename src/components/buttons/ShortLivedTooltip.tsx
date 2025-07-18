import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';

interface ShortLivedTooltipProps {
    id: string;
    content: string;
    place?: 'top' | 'bottom' | 'left' | 'right';
    duration?: number; // Durée en millisecondes (par défaut 3000ms = 3 secondes)
    style?: React.CSSProperties;
    className?: string;
}

const ShortLivedTooltip: React.FC<ShortLivedTooltipProps> = ({
    id,
    content,
    place = 'top',
    duration = 3000,
    style,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [canShow, setCanShow] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mouseLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Nettoyer les timeouts au démontage
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (mouseLeaveTimeoutRef.current) {
                clearTimeout(mouseLeaveTimeoutRef.current);
            }
        };
    }, []);

    // Gérer les événements de souris sur l'élément cible
    useEffect(() => {
        const targetElement = document.querySelector(`[data-tooltip-id="${id}"]`);

        if (!targetElement) return;

        const handleMouseEnter = () => {
            if (!canShow) return;

            setIsOpen(true);

            // Programmer la disparition après la durée spécifiée
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setIsOpen(false);
                setCanShow(false); // Empêcher de réapparaître tant que la souris n'a pas quitté
            }, duration);
        };

        const handleMouseLeave = () => {
            setIsOpen(false);

            // Nettoyer le timeout de disparition automatique
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            // Délai court pour permettre à la souris de vraiment quitter l'élément
            // avant de réautoriser l'affichage du tooltip
            if (mouseLeaveTimeoutRef.current) {
                clearTimeout(mouseLeaveTimeoutRef.current);
            }

            mouseLeaveTimeoutRef.current = setTimeout(() => {
                setCanShow(true);
            }, 100); // 100ms de délai pour éviter les flickering
        };

        targetElement.addEventListener('mouseenter', handleMouseEnter);
        targetElement.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            targetElement.removeEventListener('mouseenter', handleMouseEnter);
            targetElement.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [id, duration, canShow]);

    return (
        <Tooltip
            id={id}
            content={content}
            place={place}
            isOpen={isOpen}
            style={style}
            className={className}
        />
    );
};

export default ShortLivedTooltip;
