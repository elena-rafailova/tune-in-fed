import React, { useRef, useEffect } from 'react';

const useClickOutside = (handler, additionalSelectors) => {
    const ref = useRef();
    useEffect(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (
                !ref.current || // The reference to the wrapper element is not yet updated
                !event.target.isConnected || // The event target is no longer connected to the DOM ( has been removed )
                ref.current.contains(event.target) // the wrapper elements contains the event target
            ) {
                return;
            }

            if (
                additionalSelectors &&
                event.target.closest(additionalSelectors)
            ) {
                return;
            }

            handler(event);
        };

        document.addEventListener('click', listener);

        return () => {
            document.removeEventListener('click', listener);
        };
    }, [ref, handler]);

    return ref;
};

export default useClickOutside;
