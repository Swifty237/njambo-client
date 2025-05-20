import { createContext } from 'react';

interface StaticPage {
    slug: string;
    title: string;
    content: string;
}

interface ContentContextType {
    getLocalizedString: (key: string) => string;
    isLoading: boolean;
    staticPages: StaticPage[];
}

const contentContext = createContext<ContentContextType>({
    getLocalizedString: () => '',
    isLoading: false,
    staticPages: [],
});

export default contentContext;
