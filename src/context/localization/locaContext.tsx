import { createContext } from 'react';

// Define your context type like this:
interface LocaContextType {
    lang: string;
    setLang: React.Dispatch<React.SetStateAction<string>>;
}

// When creating the context:
const locaContext = createContext<LocaContextType>({
    lang: 'en',
    setLang: () => { },
});

export default locaContext;
