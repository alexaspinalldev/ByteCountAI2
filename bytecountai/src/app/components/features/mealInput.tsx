"use client";

// Imports
import { useState, useEffect, useCallback } from "react";

import { z } from "zod";
import { Fooditem } from "@/types";
type Fooditem = z.infer<typeof Fooditem>;

import Spinner from "../common/ui/spinner";
import { Input } from "@/app/components/common/ui/input";
import { Label } from "@/app/components/common/ui/label"
import { Button } from "@/app/components/common/ui/button"
import ResizableScrollArea from "@/app/components/common/ui/resizeableScrollArea";
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
import { BookOpen } from "lucide-react";

// ----------------------------------------------------------------

// * Input component
export default function mealInput() {
    const [mealPad, setMealPad] = useState<Fooditem[]>([]);
    const [disableMealCommit, setDisableMealCommit] = useState(false);

    // * Build the mealPad from local storage
    useEffect(() => {
        const mealPad = JSON.parse(localStorage.getItem("mealPad") as string);
        if (mealPad === null) {
            setMealPad([]);
            setDisableMealCommit(false);
        } else {
            setMealPad(mealPad);
            setDisableMealCommit(true);
        }
    }, []);

    // * Disable the commit button if the mealPad is empty
    useEffect(() => {
        if (mealPad.length === 0) {
            setDisableMealCommit(true);
        }
        else {
            setDisableMealCommit(false);
        }
    }, [mealPad]);

    // * Calculate total calories on render
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const calculatedTotal = mealPad.reduce((acc, item) => acc + item.calories, 0);
        setTotal(calculatedTotal);
    }, [mealPad]);

    // * Functions
    // * Send an item to the AI to test
    const [foodString, setFoodString] = useState("");
    const [lastFoodString, setLastFoodString] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function inputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFoodString(event.target.value);
    }


    async function testInput() {
        if (foodString === "") {
            alert(`Enter an item of food or drink to get the calories`);
            return;
        }

        setIsLoading(true); // Start loading state
        setLastFoodString(foodString); // Store the input value in case of an error

        // Fetch the response from the POST function
        let data: any;
        try {
            const response = await fetch("api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: foodString }),
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();

        } catch (error) {
            console.error("Error generating response:", error);
            setIsLoading(false); // End loading state
            foodAddFallback()
            setFoodString(lastFoodString)
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

    // * Fallback for when the API call fails
    async function foodAddFallback() {
        if (confirm(`There was a network error - add food manually?`)) {
            let manualCalories: string | null;
            do {
                manualCalories = prompt(`Calories in ${foodString}:`, "0");
                if (manualCalories === null) {
                    return; // User canceled the prompt
                }
            } while (isNaN(Number(manualCalories)) || manualCalories.trim() === "");
            const manualFoodItem: Fooditem = {
                label: foodString,
                calories: manualCalories ? parseInt(manualCalories) : 0,
                certainty: -1,
            }
            const mealPadWithNewItem = [...mealPad, manualFoodItem];
            setMealPadAndSync(mealPadWithNewItem);
            setFoodString(""); // Clear the input field
        }
    }

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

    async function commitMeal() {
        if (mealPad.length === 0) {
            alert(`No items to save`);
            setDisableMealCommit(false);
            return;
        }
        if (!mealLabel) {
            alert(`Select a name for this meal`);
            return;
        }
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
            alert(`There was an error saving the meal. Please try again later.`);
        }
    };

    return (
        <section className="flex flex-col w-full h-full p-2 md:p-4 border-gray-400 border-1 rounded-2xl">
            <div className="flex justify-between">
                <Label htmlFor="foodInput" className="px-2 text-xl md:py-2 md:text-2xl font-bold text-highlight">Meal input</Label>
            </div>
            <div className="py-2 flex items-center gap-3">
                <Input
                    onChange={inputChange}
                    value={foodString}
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
                <Button className="grow" onClick={testInput} disabled={isLoading}>{isLoading ? <Spinner /> : <>Add <Sparkles /></>}</Button>
                <Button disabled={isLoading}>
                    <BookOpen className="size-full" />
                </Button>
            </div>
            <ResizableScrollArea>
                <Table>
                    <TableBody>
                        {mealPad.map((item, index) => (
                            <TableRow key={index} className="flex items-center">
                                <TableCell onClick={(event) => editItem(event, index)} plaintext-only="true" id="foodName" className="grow">{item.label}</TableCell>
                                <TableCell className="flex items-center">
                                    <div className="min-w-6 min-h-5" onClick={(event) => editItem(event, index)} plaintext-only="true" id="foodCal">{item.calories}</div>
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
            </ResizableScrollArea>
            <div className="flex justify-between md:py-2">
                <Select value={mealLabel} onValueChange={(value) => setMealLabel(value)}  >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Meal name" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Breakfast">Breakfast</SelectItem>
                        <SelectItem value="Lunch">Lunch</SelectItem>
                        <SelectItem value="Dinner">Dinner</SelectItem>
                        <SelectItem value="Snack">Snack</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={clearMealPad}>Clear all</Button>
            </div>
            <div className="flex items-center justify-between pt-2 mt-auto">
                <div className="flex gap-2">
                    <Button disabled={disableMealCommit} onClick={commitMeal}>Commit to day</Button>
                </div>
                <div>Total: {total}</div>
            </div>
        </section >
    );
}