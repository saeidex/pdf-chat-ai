import { RefObject, useEffect } from "react";

/**
 * Hook that scrolls to the bottom of a container when its dependencies change
 * @param ref Reference to the element to scroll into view
 * @param deps Dependencies that trigger scrolling when changed
 */
export function useScrollToBottom<T extends HTMLElement>(
    ref: RefObject<T>,
    deps: any[]
) {
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [ref, deps]);
}
