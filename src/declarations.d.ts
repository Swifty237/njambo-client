//Modules
declare module 'styled-components';
declare module 'prop-types';

declare module './useContentful' {
    interface ContentfulClient {
        getEntries: (options: { content_type: string; locale: string }) => Promise<any>;
    }
    export default function useContentful(): ContentfulClient;
}

declare module 'react-remarkable';

declare module "*.jpg" {
    const value: string;
}

declare module "*.png" {
    const value: string;
}

declare module "*.svg" {
    const value: string;
}

declare module '*.gif' {
    const value: string;
}

// Constantes
declare const config: {
    contentfulSpaceId: string;
    contentfulAccessToken: string;
};

declare const theme: {
    colors: {
        playingCardBgLighter: string;
        secondaryCta: string;
        [key: string]: string;
    };
    [key: string]: any;
};
