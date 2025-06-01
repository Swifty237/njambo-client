// hooks/useChipsPosition.ts
import useResponsive from './useResponsive'; // Votre hook existant

interface ChipsPosition {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
}

interface ResponsiveChipsPositions {
    mobile: ChipsPosition;
    mobileLarge: ChipsPosition;
    tablet: ChipsPosition;
    desktop: ChipsPosition;
    desktopLarge: ChipsPosition;
    ultraWide: ChipsPosition;
}

export const useChipsPosition = () => {
    const {
        isMobile,
        isMobileLarge,
        isTablet,
        isDesktop,
        isDesktopLarge,
        isUltraWide,
        aspectRatio
    } = useResponsive();

    // Fonction pour obtenir la valeur responsive
    // A typer proprement plus tard
    const getResponsiveValue = (values: {
        mobile?: any;
        mobileLarge?: any;
        tablet?: any;
        desktop?: any;
        desktopLarge?: any;
        ultraWide?: any;
        default: any;

    }): any => {

        if (isMobile && values.mobile !== undefined) {
            console.log("isMobile : " + isMobile);
            // console.log(values.mobile);
            return values.mobile;
        }
        if (isMobileLarge && values.mobileLarge !== undefined) {
            console.log("isMobileLarge : " + isMobileLarge);
            // console.log(values.mobileLarge);
            return values.mobileLarge;
        }
        if (isTablet && values.tablet !== undefined) {
            console.log("isTablet : " + isTablet);
            // console.log(values.tablet);
            return values.tablet;
        }
        if (isDesktop && values.desktop !== undefined) {
            console.log("isDesktop : " + isDesktop);
            // console.log(values.desktop);
            return values.desktop;
        }
        if (isDesktopLarge && values.desktopLarge !== undefined) {
            console.log("isDesktopLarge : " + isDesktopLarge);
            // console.log(values.desktopLarge);
            return values.desktopLarge;
        }
        if (isUltraWide && values.ultraWide !== undefined) {
            console.log("isUltraWide : " + isUltraWide);
            // console.log(values.ultraWide);
            return values.ultraWide;
        }
        console.log("default : " + values.default);
        return values.default;
    };


    // Définition des positions pour chaque siège selon le type d'écran
    const getPositionsForSeat = (seatPosition: '1' | '2' | '3' | '4'): ResponsiveChipsPositions => {

        console.log("seatPosition : " + seatPosition);

        switch (seatPosition) {
            case '1': // Siège à gauche
                return {
                    mobile: {
                        top: '-22px',
                        left: '25px',
                    },
                    mobileLarge: {
                        left: '25px',
                    },
                    tablet: {
                        left: '60px',
                    },
                    desktop: {
                        left: '60px',
                    },
                    desktopLarge: {
                        left: '50px',
                    },
                    ultraWide: {
                    }
                };

            case '2': // Siège en haut
                return {
                    mobile: {
                        right: '65px'
                    },
                    mobileLarge: {
                        right: '90px'
                    },
                    tablet: {
                        right: '90px'
                    },
                    desktop: {
                        right: '100px'
                    },
                    desktopLarge: {
                        right: '100px'
                    },
                    ultraWide: {
                    }
                };

            case '3': // Siège à droite
                return {
                    mobile: {
                        left: '-25px',
                    },
                    mobileLarge: {
                        left: '-25px',
                    },
                    tablet: {
                        left: '-60px',
                    },
                    desktop: {
                        left: '-60px',
                    },
                    desktopLarge: {
                        left: '-50px',
                    },
                    ultraWide: {
                    }
                };

            case '4': // Siège en bas
                return {
                    mobile: {
                        left: '65px'
                    },
                    mobileLarge: {
                        left: '90px'
                    },
                    tablet: {
                        left: '90px'
                    },
                    desktop: {
                        left: '100px'
                    },
                    desktopLarge: {
                        left: '100px'
                    },
                    ultraWide: {
                    }
                };

            default:
                return {
                    mobile: { top: '50%', left: '50%' },
                    mobileLarge: { top: '50%', left: '50%' },
                    tablet: { top: '50%', left: '50%' },
                    desktop: { top: '50%', left: '50%' },
                    desktopLarge: { top: '50%', left: '50%' },
                    ultraWide: { top: '50%', left: '50%' }
                };
        }
    };

    // Fonction principale pour obtenir la position
    const getChipsPosition = (seatPosition: '1' | '2' | '3' | '4'): ChipsPosition => {
        const positions = getPositionsForSeat(seatPosition);

        // console.log("positions : ");
        // console.log(positions);

        const basePosition = getResponsiveValue({
            mobile: positions.mobile,
            mobileLarge: positions.mobileLarge,
            tablet: positions.tablet,
            desktop: positions.desktop,
            desktopLarge: positions.desktopLarge,
            ultraWide: positions.ultraWide,
            default: positions.desktop,
        });

        console.log("basePosition : ");
        console.log(basePosition);
        return basePosition;
    };

    // Fonction pour obtenir la taille des jetons selon l'écran
    const getChipsSize = () => {
        return getResponsiveValue({
            mobile: { width: '25', height: '25', fontSize: '12px' },
            mobileLarge: { width: '28', height: '28', fontSize: '14px' },
            tablet: { width: '33', height: '33', fontSize: '16px' },
            desktop: { width: '36', height: '36', fontSize: '18px' },
            desktopLarge: { width: '40', height: '40', fontSize: '20px' },
            ultraWide: { width: '45', height: '45', fontSize: '22px' },
            default: { width: '33', height: '33', fontSize: '16px' },
        });
    };

    return {
        getChipsPosition,
        getChipsSize,
        aspectRatio,
    };
};