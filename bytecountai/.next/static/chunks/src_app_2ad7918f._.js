(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_2ad7918f._.js", {

"[project]/src/app/ai/route.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$web$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/genai/dist/web/index.mjs [app-client] (ecmascript)");
;
// const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_API_KEY = "AIzaSyCWu1JBwvQbKoBEbp7SDhAFq2RtVJb26UQ";
const ai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$web$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleGenAI"]({
    apiKey: GOOGLE_API_KEY
});
async function POST(input) {
    const req = `1. Follow these instructions to the absolute letter.
2. For the given food item, provide the following information in a consistent, structured format:
- Label: A concise but specific, common name for the food.
- Calories (kcal): An estimated calorie count for the specifies quantity, or if unspecified a standard serving size.
- Certainty Score (0-1):** A score indicating how certain you are that the calorie result is accurate.
    --   1 indicates a highly specific description (e.g., '100g Tesco air-fried skinless chicken breast' or '1 slice Hovis Wholemeal Thick Sliced Bread').
    --   ~0.8 indicates a good description with brand (e.g., '100g Tesco chicken breast' or '1 slice Hovis brown bread').
    --   ~0.6 indicates a good description with quantity but no brand (e.g., '100g chicken breast' or '1 slice of brown bread').
    --   ~0.5 indicates a vague description with quantity (e.g., '100g chicken' or '1 slice of bread').
    --   ~0.1 indicates a vague description with no quantity or brand (e.g., 'Chicken' or "Bread)
    --   0 indicates a result that is totally impossible to analyse (e.g., 'Food').
4. Return "{ invalid }" for non-foodstuff.
5. Do not include any additional text or explanations in the response, and do not add styling or markdown to the response.
6. Use the following JSON format for the response. Note label is a string, calories is an integer, and certainty is a decimal:
"{"label": "[Label]", "calories": [Calories], "certainty": [Certainty Score]}"

Food Item: ${input}`;
    // TODO: expand to include other macronutrients, and add advanced mode to frontend
    // TODO: Need to ensure debouncing is in place for API calls
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: req
                        }
                    ]
                }
            ],
            config: {
                temperature: 0.0
            }
        });
        // Extract text from response
        const data = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        const output = JSON.parse(data);
        // console.log(output);
        return output;
    } catch (error) {
        console.error("Error generating content:", error);
        console.log("Trying alternative model...");
        // Fallback to the alternative model
        try {
            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: req
                            }
                        ]
                    }
                ],
                config: {
                    temperature: 0.0
                }
            });
            // Extract text from response
            const data = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            const output = JSON.parse(data);
            // console.log(output);
            return output;
        } catch (error) {
            console.error("Error generating content:", error);
            return "{ error }";
        }
    }
}
_c = POST;
var _c;
__turbopack_context__.k.register(_c, "POST");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/components/input.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Input)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ai$2f$route$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/ai/route.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Zod schema for Fooditem
const Fooditem = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string(),
    calories: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].coerce.number(),
    certainty: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].coerce.number()
});
function Input() {
    _s();
    const [foodString, setFoodString] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [mealPad, setMealPad] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // * Build the mealPad from local storage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Input.useEffect": ()=>{
            const mealPad = JSON.parse(localStorage.getItem("mealPad"));
            if (mealPad === null) {
                setMealPad([]);
            } else {
                setMealPad(mealPad);
            }
        }
    }["Input.useEffect"], []);
    // [] is the dependency array. If you want to run the effect only once, you can pass an empty array [] as the second argument.
    // * Calculate total calories on render
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Input.useEffect": ()=>{
            const calculatedTotal = mealPad.reduce({
                "Input.useEffect.calculatedTotal": (acc, item)=>acc + item.calories
            }["Input.useEffect.calculatedTotal"], 0);
            setTotal(calculatedTotal);
        // console.log("Total calories:", calculatedTotal);
        }
    }["Input.useEffect"], [
        mealPad
    ]);
    // Here the dependency array is mealPad, so the effect will run whenever mealPad changes.
    // * Functions
    // * Send an item to the AI to test
    async function testInput() {
        const inputElement = document.getElementById("foodInput");
        if (inputElement.value === "") {
            return;
        }
        setIsLoading(true); // Start loading state
        const inputValue = inputElement.value;
        setFoodString(inputValue);
        inputElement.value = "";
        // Fetch the response from the POST function
        let response;
        try {
            response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ai$2f$route$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POST"])(inputValue);
        } catch (error) {
            console.error("Error generating content:", error);
            alert(`There was an error - please try again.`);
            inputElement.value = foodString;
            return;
        // TODO: Centralise client-side error handling
        } finally{
            setIsLoading(false); // End loading state and proceed with the rest of the cod
            // Check if the response is an error, invalid or empty, or type it accordingly
            const responseAsString = JSON.stringify(response);
            if (responseAsString.includes("{ invalid }")) {
                inputElement.value = "";
                alert(`The supplied input is not food!`); // A problem with the user being a sicko
                return;
            // TODO: Centralise client-side error handling
            }
            if (responseAsString.includes("{ error }") || responseAsString === "") {
                alert(`There was an error - please try again.`); // Some other AI call error
                inputElement.value = foodString;
                return;
            }
            // Validate the response type with Zod
            if (!Fooditem.safeParse(response).success) {
                console.error("Invalid response format:", response);
                alert(`There was an error - please contact the admin.`); // A problem with the prompt
                inputElement.value = foodString;
                return;
            }
            // Cast it to Fooditem
            const validResponse = response;
            // Update the mealPad state with the new food item
            const mealPadWithNewItem = [
                ...mealPad,
                validResponse
            ];
            setMealPadAndSync(mealPadWithNewItem);
        }
    }
    // * Edit item in the mealPad
    // Make the item editable on click
    async function editItem(event, index) {
        // Prevent the click event from bubbling up to the li element
        event.stopPropagation();
        const div = event.target;
        let oldValue = div.textContent;
        div.contentEditable = "true";
        div.focus();
        // Blur event to save the edited item
        const handleBlur = ()=>{
            if (div.textContent === "") {
                div.textContent = oldValue;
                return;
            } else if (div.textContent === oldValue) {
                return;
            } else {
                // Show warning if the user tries to enter a non-numeric value for calories
                if (div.id === "foodCal" && isNaN(parseInt(div.textContent))) {
                    alert("Calories must be a number");
                    div.textContent = oldValue;
                    return;
                }
                // Save the edited item
                const newValue = div.textContent;
                div.contentEditable = "false";
                let newItem = {
                    ...mealPad[index]
                };
                // switch case for whether its the label or the calories we're editing
                if (div.id === "foodName") {
                    newItem = {
                        ...mealPad[index],
                        label: newValue
                    };
                } else if (div.id === "foodCal") {
                    newItem = {
                        ...mealPad[index],
                        calories: parseInt(newValue),
                        certainty: -1
                    };
                }
                // Replace the item at the index with the new item
                const mealPadWithEditedItem = [
                    ...mealPad
                ];
                mealPadWithEditedItem.splice(index, 1, newItem);
                setMealPadAndSync(mealPadWithEditedItem);
            }
            ;
            // Remove the blur event listener to prevent memory leaks
            div.removeEventListener("blur", handleBlur);
            div.removeEventListener("keydown", handleBlur);
        };
        // Add the blur event listener to the div
        div.addEventListener("blur", handleBlur);
        // Add the keydown event listener to the div
        div.addEventListener("keydown", (event)=>{
            if (event.key === "Enter") {
                event.preventDefault();
                handleBlur();
            }
        });
    }
    // * Clear entire mealPad
    async function clearMealPad() {
        alert("Are you sure you want to clear all items?");
        setMealPadAndSync([]);
    }
    // * Delete items from mealPad
    async function removeItem(itemId, prevMealPad = mealPad) {
        setMealPadAndSync(prevMealPad.filter((_, index)=>index !== itemId));
    }
    // * Update the mealPad state and sync with local storage
    function setMealPadAndSync(mealPad) {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col w-full p-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "w-full p-2 mb-2 bg-gray-200 rounded-lg disabled:bg-gray-300",
                ...isLoading ? {
                    placeholder: "Fetching..."
                } : {
                    placeholder: "Enter food item"
                },
                // onChange={(event) => setFoodString(event.target.value)}
                onKeyDown: (event)=>{
                    if (event.key === "Enter") {
                        event.preventDefault();
                        testInput();
                    }
                },
                // onBlur={(event) => {
                //     const inputElement = event.target as HTMLInputElement;
                //     if (inputElement.value === "") {
                //         inputElement.value = foodString;
                //         inputElement.placeholder = "Enter food item";
                //     }
                // }}
                autoComplete: "on",
                autoCorrect: "on",
                autoCapitalize: "sentences",
                spellCheck: "true",
                autoFocus: true,
                autoSave: "on",
                type: "text",
                id: "foodInput",
                disabled: isLoading
            }, void 0, false, {
                fileName: "[project]/src/app/components/input.tsx",
                lineNumber: 194,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: isLoading,
                        className: "w-1/2 m-2 border-2 border-gray-300 cursor-pointer rounded-2xl",
                        onClick: testInput,
                        children: isLoading ? "" : "Add"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/input.tsx",
                        lineNumber: 223,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "w-1/2 m-2 border-2 border-gray-300 cursor-pointer rounded-2xl",
                        onClick: clearMealPad,
                        children: "Clear all"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/input.tsx",
                        lineNumber: 226,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/input.tsx",
                lineNumber: 221,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                id: "mealPadUl",
                className: "px-2",
                children: mealPad.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center justify-between p-2 border-b-2 border-gray-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between grow",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: (event)=>editItem(event, index),
                                        "plaintext-only": "true",
                                        id: "foodName",
                                        className: "grow",
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/input.tsx",
                                        lineNumber: 232,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: (event)=>editItem(event, index),
                                                "plaintext-only": "true",
                                                id: "foodCal",
                                                children: item.calories
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/input.tsx",
                                                lineNumber: 234,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm",
                                                children: " kcal"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/input.tsx",
                                                lineNumber: 235,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/input.tsx",
                                        lineNumber: 233,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/input.tsx",
                                lineNumber: 231,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[2rem]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: item.certainty === -1 ? "hidden" : item.certainty <= 0.4 ? "text-red-500" : item.certainty > 0.4 && item.certainty <= 0.7 ? "text-yellow-500" : "text-green-500",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                height: 32,
                                                width: 32,
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                        strokeWidth: "0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/input.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 132
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/input.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 155
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                        children: [
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5Z",
                                                                fill: "currentColor"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/input.tsx",
                                                                lineNumber: 244,
                                                                columnNumber: 211
                                                            }, this),
                                                            " "
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/input.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 207
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/input.tsx",
                                                lineNumber: 244,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/input.tsx",
                                            lineNumber: 240,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/input.tsx",
                                        lineNumber: 239,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute w-[200px] hidden p-1 text-center bg-gray-400 rounded-full text-md top-2 group-hover:block",
                                        children: item.certainty < 0.4 ? "Adding weight/quantity, brand or preparation method can improve accuracy " : "Certainty: " + item.certainty
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/input.tsx",
                                        lineNumber: 247,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/input.tsx",
                                lineNumber: 238,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "px-2 border-2 border-gray-300 rounded-lg cursor-pointer",
                                onClick: ()=>removeItem(index),
                                children: "Remove"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/input.tsx",
                                lineNumber: 250,
                                columnNumber: 25
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/src/app/components/input.tsx",
                        lineNumber: 230,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/components/input.tsx",
                lineNumber: 228,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between p-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "cursor-pointer",
                        children: "Commit to day"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/input.tsx",
                        lineNumber: 256,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Total: ",
                            total
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/input.tsx",
                        lineNumber: 257,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/input.tsx",
                lineNumber: 255,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/input.tsx",
        lineNumber: 193,
        columnNumber: 9
    }, this);
}
_s(Input, "tN6Jm8+Pxgk6Juiu2gwhUbQsekI=");
_c = Input;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_2ad7918f._.js.map