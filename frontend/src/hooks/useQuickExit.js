import { useEffect } from 'react';

/**
 * Custom hook to provide a global "Quick Exit" keyboard shortcut.
 * Triple-tapping the 'Escape' key will redirect the user to a neutral site.
 */
const useQuickExit = () => {
    useEffect(() => {
        let escCount = 0;
        let lastEscTime = 0;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                const currentTime = new Date().getTime();

                // If the gap between Esc presses is less than 500ms, count it
                if (currentTime - lastEscTime < 500) {
                    escCount++;
                } else {
                    escCount = 1;
                }

                lastEscTime = currentTime;

                if (escCount >= 3) {
                    // Standard neutral redirect for ARAM safety
                    window.location.href = 'https://www.google.com/search?q=weather+today';
                }

                // Reset count after a short delay if no more Esc presses occur
                setTimeout(() => {
                    if (new Date().getTime() - lastEscTime >= 500) {
                        escCount = 0;
                    }
                }, 600);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
};

export default useQuickExit;
