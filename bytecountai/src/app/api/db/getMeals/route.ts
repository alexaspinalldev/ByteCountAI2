import { db, meals } from "@/db/index";
import { eq, and } from "drizzle-orm";

// * Function to get all a day's meals for a user
export async function POST(Req: Request) {
    try {
        let { userId, date } = await Req.json();
        date = new Date(date);
        const response = await db.select().from(meals).where(
            and(
                eq(meals.userId, userId),
                // eq(meals.dateTimeAdded, date)
                // TODO: Problem is that the date is too specific, causing it to not match the date in the database. We can reduce the specificity when adding meals but we also need to query by day and not time.
            )
        )
            .orderBy(meals.dateTimeAdded);
        // An empty response is valid, so we don't need to check for it
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching meals:", error);
        return new Response("Error fetching meals", { status: 500 });
    }
}