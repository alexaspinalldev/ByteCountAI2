import { GoogleGenAI } from "@google/genai";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

export async function POST(request: Request) {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }
    const { input } = await request.json();
    const req =
        `1. Follow these instructions to the absolute letter.
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
4. Return "{"invalid: invalid"}" for non-foodstuff.
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
                    parts: [{ text: req }]
                }
            ],
            config: {
                temperature: 0.0
            }
        });

        // Extract text from response
        const data: string = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        // success(data);
        console.log("Response data:", data);
        return new Response(JSON.stringify(JSON.parse(data)), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

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
                        parts: [{ text: req }]
                    }
                ],
                config: {
                    temperature: 0.0
                }
            });

            // Extract text from response
            const data: string = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            // success(data);
            return new Response(JSON.stringify(JSON.parse(data)), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });

        } catch (error) {
            // failure(error)
            console.error("Error generating content:", error);
            return new Response(`{"error": "error"}`, {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
}

// Functions to handle success and failure responses
// function success(data: string) {

//     return new Response(JSON.stringify(JSON.parse(data)), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//     });
// }
// function failure(error: unknown) {
//     console.error("Error generating content:", error);
//     return new Response("{ error }", {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//     });
// }
