import { createContext } from 'react';


interface ContentContextType {
    getLocalizedString: (key: string) => string;
}

const contentContext = createContext<ContentContextType>({
    getLocalizedString: () => '',
});

export default contentContext;
