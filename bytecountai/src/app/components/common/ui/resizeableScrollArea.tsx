import { ScrollArea } from "./scroll-area";

import { useEffect, useRef } from "react";

export default function ResizableScrollArea({ children }: { children: React.ReactNode }) {
    const scrollAreaContainer = useRef<HTMLDivElement | null>(null);
    const scrollArea = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updateHeight = () => {
            const newHeight = scrollAreaContainer?.current!.clientHeight;
            if (scrollArea.current) {
                scrollArea.current.style.height = `${newHeight}px`; // Set the height of the scroll area
            }
        }
        updateHeight()

        // Update height on window resize - initialise the height back to 0 to allow for the parent to flex smaller than the child
        window.addEventListener("resize", () => {
            if (scrollAreaContainer.current) {
                scrollAreaContainer.current.style.height = `0px`;
            }
            updateHeight()
        });

        // Cleanup event listener on unmount
        return () => window.removeEventListener("resize", updateHeight);
    }, []
    );

    return (
        <div className="grow" ref={scrollAreaContainer}>
            {/* ^Used to explicity set the height of the ScrollArea */}
            <ScrollArea ref={scrollArea} id="mealPadUl" className="py-2 bg-zinc-900 rounded-lg">
                {children}
            </ScrollArea >
        </div>
    )
}