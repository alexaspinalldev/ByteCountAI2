import { ScrollArea } from "./scroll-area";

import { useState, useEffect, useRef } from "react";

export default function ResizableScrollArea({ children }: { children: React.ReactNode }) {

    // * Set the height of the scroll area on window resize or mount
    const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
    const scrollAreaContainer = useRef<HTMLDivElement | null>(null);
    const scrollArea = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const updateHeight = () => {
            const newHeight = scrollAreaContainer?.current!.clientHeight;
            setScrollAreaHeight(newHeight); // Update state with the new height
        }
        updateHeight()
        // Update height on window resize
        window.addEventListener("resize", updateHeight);
        // Cleanup event listener on unmount
        return () => window.removeEventListener("resize", updateHeight);
    }, []);
    // scrollAreaContainer.current.clientHeight = scrollAreaHeight;
    console.log(scrollAreaHeight)
    // ! This works better now for initial render but cannot handle window resizing due to how we're inbjecting the height as inline style
    // ! Needs to be refactored to use a component that wraps around children
    // ! Needs to use a resize observer to handle resizing

    return (
        <div className="grow" ref={scrollAreaContainer}>
            {/* ^Used to explicity set the height of the ScrollArea */}
            {/* // TODO: Make your expanding scrollarea a component you wrap around children */}
            <ScrollArea ref={scrollArea} id="mealPadUl" className="py-2 bg-gray-100 dark:bg-zinc-900" style={{ height: `${scrollAreaHeight}px` }}>
                {children}
            </ScrollArea >
        </div>
    )
}