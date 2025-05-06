import { RefObject, useEffect } from "react";

/**
 * Hook that automatically adjusts the height of a textarea based on its content
 * @param ref Reference to the textarea element
 * @param value The current value of the textarea that triggers resize on change
 * @param maxHeight Optional maximum height for the textarea (default: 150px)
 */
export function useAutoResizeTextarea<T extends HTMLTextAreaElement>(
    ref: RefObject<T>,
    value: string,
    maxHeight: number = 150
) {
    useEffect(() => {
        const textarea = ref.current;
        if (!textarea) return;

        const adjustHeight = () => {
            textarea.style.height = "auto";
            const newHeight = Math.min(textarea.scrollHeight, maxHeight);
            textarea.style.height = `${newHeight}px`;
        };

        adjustHeight();
    }, [value, maxHeight, ref]);
}
