"use client";

// Imports
import { useState, useEffect, useCallback, useRef, use } from "react";
import { set, z } from "zod";

import Spinner from "../common/ui/spinner";

import { Input } from "@/app/components/common/ui/input";
import { Label } from "@/app/components/common/ui/label"
import { Button } from "@/app/components/common/ui/button"
import { ScrollArea } from "@/app/components/common/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/common/ui/select"

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/app/components/common/ui/table"

import { Sparkles } from 'lucide-react';

// ----------------------------------------------------------------

// Zod schema for Fooditem
const Fooditem = z.object({
    label: z.string(),
    calories: z.coerce.number(),
    certainty: z.coerce.number(),
});

type Fooditem = z.infer<typeof Fooditem>;

// * Input component
export default function mealInput() {
    const [mealPad, setMealPad] = useState<Fooditem[]>([]);

    // * Build the mealPad from local storage
    useEffect(() => {
        const mealPad = JSON.parse(localStorage.getItem("mealPad") as string);
        if (mealPad === null) {
            setMealPad([]);
        } else {
            setMealPad(mealPad);
        }
    }, []);
    // [] is the dependency array. If you want to run the effect only once, you can pass an empty array [] as the second argument.

    // * Calculate total calories on render
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const calculatedTotal = mealPad.reduce((acc, item) => acc + item.calories, 0);
        setTotal(calculatedTotal);
    }, [mealPad]);
    // Here the dependency array is mealPad, so the effect will run whenever mealPad changes.

    // * Functions
    // * Send an item to the AI to test
    const [foodString, setFoodString] = useState("");
    const [lastFoodString, setLastFoodString] = useState("");
    // const inputElement = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // TODO: Function to handle any changes to the input field and update the state
    function inputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFoodString(event.target.value);
    }


    async function testInput() {
        if (foodString === "") {
            return;
        }

        setIsLoading(true); // Start loading state
        setLastFoodString(foodString); // Store the input value in case of an error

        // Fetch the response from the POST function
        let data: unknown;
        try {
            const response = await fetch("api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: foodString }),
            })
            data = await response.json();

        } catch (error) {
            console.error("Error generating content:", error);
            alert(`There was a network error - please try again.`);
            setIsLoading(false); // End loading state
            setFoodString(lastFoodString); // Set the input field back to the lastFoodString
            // TODO: Add fallback for manual input
            return;
        }
        finally {
            setIsLoading(false); // End loading state and proceed with the rest of the code

            // Check if the response is an error, invalid or empty, or type it accordingly
            const responseAsString: string = JSON.stringify(data);
            if (responseAsString.includes("invalid")) {
                setFoodString(""); // Clear the input field
                alert(`The supplied input is not food!`); // A problem with the user being a sicko
                return;
            }
            if (responseAsString.includes("error") || responseAsString === "") {
                alert(`There was an undefined network error - please try again.`); // Some other AI call error
                setFoodString(lastFoodString); // Restore the input field
                return;
            }
            // Validate the response type with Zod
            if (!Fooditem.safeParse(data).success) {
                console.error("Invalid response format:", data);
                alert(`There was an AI error - please contact the admin.`); // A problem with the prompt
                setFoodString(lastFoodString); // Restore the input field
                return;
            }

            // Cast it to Fooditem
            const validResponse = data as Fooditem;
            // Update the mealPad state with the new food item
            const mealPadWithNewItem = [...mealPad, validResponse];
            setMealPadAndSync(mealPadWithNewItem);
            setFoodString(""); // Clear the input field
        }
    };

    // * Edit item in the mealPad
    // Make the item editable on click
    async function editItem(event: React.MouseEvent<HTMLDivElement>, index: number) {
        // Prevent the click event from bubbling up to the li element
        event.stopPropagation();
        const div = event.target as HTMLLIElement;
        let oldValue = div.textContent;
        div.contentEditable = "true";
        div.focus();

        // Blur event to save the edited item
        const handleBlur = () => {
            if (div.textContent === "") {
                div.textContent = oldValue;
                return
            }
            else if (div.textContent === oldValue) {
                return
            } else {
                // Show warning if the user tries to enter a non-numeric value for calories
                if (div.id === "foodCal" && isNaN(parseInt(div.textContent!))) {
                    alert(`Calories must be a number`);
                    div.textContent = oldValue;
                    return
                }
                // Save the edited item
                const newValue = div.textContent;
                div.contentEditable = "false";

                let newItem = { ...mealPad[index] };

                // switch case for whether its the label or the calories we're editing
                if (div.id === "foodName") {
                    newItem = { ...mealPad[index], label: newValue! };
                } else if (div.id === "foodCal") {
                    newItem = { ...mealPad[index], calories: parseInt(newValue!), certainty: -1 };
                }

                // Replace the item at the index with the new item
                const mealPadWithEditedItem = [...mealPad];
                mealPadWithEditedItem.splice(index, 1, newItem);
                setMealPadAndSync(mealPadWithEditedItem);
            };
            // Remove the blur event listener to prevent memory leaks
            div.removeEventListener("blur", handleBlur);
            div.removeEventListener("keydown", handleBlur);

        };
        // Add the blur event listener to the div
        div.addEventListener("blur", handleBlur);
        // Add the keydown event listener to the div
        div.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleBlur();
            }
        });
    };


    // * Clear entire mealPad
    // Use useCallback to memoize the function. The empty array means it will only be created once and is not called on every render
    // This is important for performance and to avoid unnecessary re-renders
    // There is no issue with accessing the state variable becaue it's not a dependency
    const clearMealPad = useCallback(async () => {
        if (confirm(`Are you sure you want to clear the meal?`)) {
            setMealPadAndSync([]);
            localStorage.removeItem("mealPad");
        }
    }, []);


    // * Delete items from mealPad
    async function removeItem(itemId: number, prevMealPad: Fooditem[] = mealPad) {
        setMealPadAndSync(prevMealPad.filter((_: Fooditem, index: number) => index !== itemId));
    };

    // * Update the mealPad state and sync with local storage
    async function setMealPadAndSync(mealPad: Fooditem[]) {
        setMealPad(mealPad);
        localStorage.setItem("mealPad", JSON.stringify(mealPad));
    };

    // * Post to day of eating/DB
    const [mealLabel, setMealLabel] = useState("");
    const mealBody = JSON.stringify(mealPad);
    const totalCalories = total;
    const userId = 1; // TODO: Get the user ID from the session

    function mealLabelChange(value: string) {
        setMealLabel(value);
    }
    // TODO: As it stands this is no good - we have a race condition between the mealLabel being set and commitMeal potentially being called

    async function commitMeal() {
        if (!mealLabel) {
            alert(`Select a label for this meal`);
            return;
        }
        console.log(mealLabel)
        try {
            const response = await fetch("api/db/postMeal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ totalCalories, mealLabel, mealBody, userId }),
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                setMealPadAndSync([]);
                alert(`Meal saved successfully!`);
                // TODO: Need to think about optimistically updating the UI too - update a context with the new meal
            }
        } catch (error) {
            console.error("Error posting meal:", error);
            alert(`There was an error saving the meal. Please try again.`);
        }
    };

    // * Set the height of the scroll area on window resize or mount
    const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
    const scrollAreaContainer = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const updateHeight = () => {
            if (scrollAreaContainer) {
                const newHeight = scrollAreaContainer.current!.clientHeight;
                setScrollAreaHeight(newHeight); // Update state with the new height
            }
        };
        // Set initial height
        updateHeight();
        // Update height on window resize
        window.addEventListener("resize", updateHeight);
        // Cleanup event listener on unmount
        return () => window.removeEventListener("resize", updateHeight);
    }, []); // Dependency array ensures this effect runs only once
    // TODO: Something else is making the input component taller than it should be

    return (
        <section className="flex flex-col w-full h-full p-2 border-gray-400 border-1 rounded-2xl">
            <Label htmlFor="foodInput" className="p-2 text-2xl font-bold text-highlight">Meal input</Label>
            <Input
                onChange={inputChange}
                value={foodString}
                className="mb-2"
                {...isLoading ? { placeholder: "Fetching..." } : { placeholder: "Enter food item" }}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        testInput();
                    }
                }}
                // onBlur={(event) => {
                //     const inputElement = event.target as HTMLInputElement;
                //     if (inputElement.value === "") {
                //         inputElement.value = foodString;
                //         inputElement.placeholder = "Enter food item";
                //     }
                // }}
                autoComplete="on"
                autoCorrect="on"
                autoCapitalize="sentences"
                spellCheck="true"
                autoFocus
                autoSave="on"
                type="text"
                id="foodInput"
                disabled={isLoading}
            />
            <div className="flex gap-0">
                <Button className="mb-2 grow" onClick={testInput} disabled={isLoading}>{isLoading ? <Spinner /> : <>Add <Sparkles /></>}</Button>
            </div>
            <div className="grow" ref={scrollAreaContainer}>
                {/* ^Used to explicity set the heght of the ScrollArea */}
                <ScrollArea id="mealPadUl" className="py-2 bg-gray-100 dark:bg-zinc-900" style={{ height: `${scrollAreaHeight}px` }}>
                    <Table>
                        <TableBody>
                            {mealPad.map((item, index) => (
                                <TableRow key={index} className="flex items-center">
                                    <TableCell onClick={(event) => editItem(event, index)} plaintext-only="true" id="foodName" className="grow">{item.label}</TableCell>
                                    <TableCell className="flex items-center">
                                        <div onClick={(event) => editItem(event, index)} plaintext-only="true" id="foodCal">{item.calories}</div>
                                        <div className="text-sm">&nbsp;kcal</div>
                                    </TableCell>
                                    <TableCell className="relative px-0 group">
                                        <div className="w-[2rem]">
                                            <div className={item.certainty === -1 ? "hidden" :
                                                item.certainty <= 0.4 ? "text-red-500" :
                                                    item.certainty > 0.4 && item.certainty <= 0.7 ? "text-yellow-500" :
                                                        "text-green-500"}>
                                                <svg height={32} width={32} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5Z" fill="currentColor"></path> </g></svg>
                                            </div>
                                        </div>
                                        {/* Certainty hint/tooltip */}
                                        <div className="absolute w-[200px] hidden p-1 text-center bg-gray-400 rounded-full text-md top-2 group-hover:block">{item.certainty < 0.4 ? "Adding weight/quantity, brand or preparation method can improve accuracy " : "Certainty: " + item.certainty}</div>
                                    </TableCell>
                                    <TableCell><Button size="sm" variant="outline" onClick={() => removeItem(index)}>Remove</Button></TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                </ScrollArea >
                <div className="flex justify-end py-2">
                    <Button className="" variant="outline" onClick={clearMealPad}>Clear all</Button>
                </div>
            </div>
            <div className="flex items-center justify-between py-2 mt-auto">
                <div className="flex gap-2">
                    <Button onClick={commitMeal}>Commit to day</Button>
                    <Select value={mealLabel} onValueChange={(value) => mealLabelChange(value)}  >
                        <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Meal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Breakfast">Breakfast</SelectItem>
                            <SelectItem value="Lunch">Lunch</SelectItem>
                            <SelectItem value="Dinner">Dinner</SelectItem>
                            <SelectItem value="Snack">Snack</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>Total: {total}</div>
            </div>
        </section >
    );
}