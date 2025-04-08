"use client";

import { useState, useEffect } from "react";
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
    async function testInput() {
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
            // TODO: Centralise client-side error handling
        }
        finally {
            setIsLoading(false); // End loading state and proceed with the rest of the code

            // Check if the response is an error, invalid or empty, or type it accordingly
            const responseAsString: string = JSON.stringify(data);
            if (responseAsString.includes("invalid")) {
                inputElement!.value = "";
                alert(`The supplied input is not food!`); // A problem with the user being a sicko
                return;
                // TODO: Centralise client-side error handling
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
    }


    // * Clear entire mealPad
    async function clearMealPad() {
        alert("Are you sure you want to clear all items?");
        setMealPadAndSync([]);
    }


    // * Delete items from mealPad
    async function removeItem(itemId: number, prevMealPad: Fooditem[] = mealPad) {
        setMealPadAndSync(prevMealPad.filter((_: Fooditem, index: number) => index !== itemId))
    }

    // * Update the mealPad state and sync with local storage
    function setMealPadAndSync(mealPad: Fooditem[]) {
        setMealPad(mealPad);
        localStorage.setItem("mealPad", JSON.stringify(mealPad));
    }

    // TODO: Post to day of eating/DB
    // const mealCommit = {
    // mealLabel: meallabel,
    // userId: userId,
    // date: date,
    // mealContent: mealPad };

    // Post this to my server component
    // setMealPadAndSync([]]);
    // The server component will then post this to the DB
    // If the DB post fails, return the mealPad, local storage and DOM to its previous state


    return (
        <div className="flex flex-col w-full p-2">
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
                <Button className="grow" onClick={clearMealPad}>Clear all</Button>
            </div>
            <ul id="mealPadUl" className="px-2">
                {mealPad.map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-2 border-b-2 border-gray-300">
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
            <div className="flex justify-between p-2">
                <Button>Commit to day</Button>
                <div>Total: {total}</div>
            </div>
        </div >
    );
}