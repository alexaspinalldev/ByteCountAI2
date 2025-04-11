"use client";

import { useState, useEffect, useCallback } from "react";
// import { POST } from "../api/post";
import { z } from "zod";

import Spinner from "./utilities/spinner";
import Button from "./utilities/button";

// Zod schema for Fooditem
const Fooditem = z.object({
    label: z.string(),
    calories: z.coerce.number(),
    certainty: z.coerce.number(),
});

type Fooditem = z.infer<typeof Fooditem>;

// * Input component
export default function Input() {
    const [foodString, setFoodString] = useState("");
    const [mealPad, setMealPad] = useState<Fooditem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
    const testInput = useCallback(async () => {
        const inputElement = document.getElementById("foodInput") as HTMLInputElement | null;
        if (inputElement!.value === "") {
            return;
        }

        setIsLoading(true); // Start loading state
        const inputValue: string = inputElement!.value;
        setFoodString(inputValue);
        inputElement!.value = "";

        // Fetch the response from the POST function
        let data: unknown;
        try {
            const response = await fetch("api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: inputValue }),
            })
            data = await response.json();

        } catch (error) {
            console.error("Error generating content:", error);
            alert(`There was a network error - please try again.`);
            inputElement!.value = foodString;
            return;
        }
        finally {
            setIsLoading(false); // End loading state and proceed with the rest of the code

            // Check if the response is an error, invalid or empty, or type it accordingly
            const responseAsString: string = JSON.stringify(data);
            if (responseAsString.includes("invalid")) {
                inputElement!.value = "";
                alert(`The supplied input is not food!`); // A problem with the user being a sicko
                return;
            }
            if (responseAsString.includes("error") || responseAsString === "") {
                alert(`There was an undefined network error - please try again.`); // Some other AI call error
                inputElement!.value = foodString;
                return;
            }
            // Validate the response type with Zod
            if (!Fooditem.safeParse(data).success) {
                console.error("Invalid response format:", data);
                alert(`There was an AI error - please contact the admin.`); // A problem with the prompt
                inputElement!.value = foodString;
                return;
            }

            // Cast it to Fooditem
            const validResponse = data as Fooditem;

            // Update the mealPad state with the new food item
            const mealPadWithNewItem = [...mealPad, validResponse];
            setMealPadAndSync(mealPadWithNewItem);
            inputElement!.focus();
        }
    }, []);

    // * Edit item in the mealPad
    // Make the item editable on click
    const editItem = useCallback(async (event: React.MouseEvent<HTMLDivElement>, index: number) => {
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
                    alert("Calories must be a number");
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
        }
        );
    }, []);


    // * Clear entire mealPad
    const clearMealPad = useCallback(async () => {
        alert("Are you sure you want to clear the meal?");
        setMealPadAndSync([]);
    }, [])


    // * Delete items from mealPad
    // Use useCallback to memoize the function. The empty array means it will only be created once and is not called on every render
    // This is important for performance and to avoid unnecessary re-renders
    const removeItem = useCallback(async (itemId: number, prevMealPad: Fooditem[] = mealPad) => {
        setMealPadAndSync(prevMealPad.filter((_: Fooditem, index: number) => index !== itemId));
    }, []);


    // * Update the mealPad state and sync with local storage
    const setMealPadAndSync = useCallback(async (mealPad: Fooditem[]) => {
        setMealPad(mealPad);
        localStorage.setItem("mealPad", JSON.stringify(mealPad));
    }, []);

    // * Post to day of eating/DB
    const mealBody = JSON.stringify(mealPad);
    const totalCalories = total;
    const label = "Meal" // TODO: Allow user to name the meal
    const userId = 1; // TODO: Get the user ID from the session
    const commitMeal = useCallback(async () => {
        try {
            const response = await fetch("api/db", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ totalCalories, label, mealBody, userId }),
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                setMealPadAndSync([]);
                alert("Meal saved successfully!");
                // TODO: Need to think about optimistically updating the UI too
            }
        } catch (error) {
            console.error("Error posting meal:", error);
            alert("There was an error saving the meal. Please try again.");
        }
    }, []);


    return (
        <section className="flex flex-col p-2 w-full md:w-[45%] border-1 border-gray-400 rounded-2xl max-h-[50%] md:max-h-full">
            <h1 className="text-2xl text-highlight font-bold p-2">Meal input</h1>
            <input className="w-full p-2 mb-2 text-gray-800 bg-gray-400 rounded-lg"
                // TODO: Add ternary for className for loading state (disabled: psuedoselector doesn't work)
                {...isLoading ? { placeholder: "Fetching..." } : { placeholder: "Enter food item" }}
                // onChange={(event) => setFoodString(event.target.value)}
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
                <Button className="grow" onClick={testInput} disabled={isLoading}>{isLoading ? <Spinner /> : "Add"}</Button>
            </div>
            <ul id="mealPadUl" className="px-2 overflow-scroll bg-[#002002] rounded-2xl my-2">
                {mealPad.map((item, index) => (
                    <li key={index} className="flex items-center justify-between pb-2 border-b-1 border-gray-500 mb-2">
                        <div className="flex justify-between grow">
                            <div onClick={(event) => editItem(event, index)} plaintext-only="true" id="foodName" className="grow">{item.label}</div>
                            <div className="flex">
                                <div onClick={(event) => editItem(event, index)} plaintext-only="true" id="foodCal">{item.calories}</div>
                                <div className="text-sm">&nbsp;kcal</div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="w-[2rem]">
                                <div className={item.certainty === -1 ? "hidden" :
                                    item.certainty <= 0.4 ? "text-red-500" :
                                        item.certainty > 0.4 && item.certainty <= 0.7 ? "text-yellow-500" :
                                            "text-green-500"}>
                                    <svg height={32} width={32} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5Z" fill="currentColor"></path> </g></svg>
                                </div>
                            </div>
                            <div className="absolute w-[200px] hidden p-1 text-center bg-gray-400 rounded-full text-md top-2 group-hover:block">{item.certainty < 0.4 ? "Adding weight/quantity, brand or preparation method can improve accuracy " : "Certainty: " + item.certainty}
                            </div>
                        </div>
                        <Button onClick={() => removeItem(index)}>Remove</Button>
                    </li>
                ))
                }
            </ul >
            <div className="flex justify-between p-2 items-center">
                <div className="flex gap-2">
                    <Button onClick={commitMeal}>Commit to day</Button>
                    <Button className="" onClick={clearMealPad}>Clear all</Button>
                </div>
                <div>Total: {total}</div>
            </div>
        </section >
    );
}