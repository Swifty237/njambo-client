import { useState } from "react";

// Hook personnalisé pour gérer clic simple et double clic
const useClickHandler = (onClick: () => void, onDoubleClick: () => void, delay = 200) => {
    const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleClick = () => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
            onDoubleClick();
        } else {
            const timeout = setTimeout(() => {
                onClick();
                setClickTimeout(null);
            }, delay);
            setClickTimeout(timeout);
        }
    };

    return handleClick;
};

export default useClickHandler;