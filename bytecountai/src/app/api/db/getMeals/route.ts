import { db, meals } from "@/db/index";

type MealSchema = typeof meals.$inferSelect;

// * Function to get all a day's meals for a user
export async function GET(Req: Request) {
    // Parse the request body
    const { userId, date } = await Req.json();
}