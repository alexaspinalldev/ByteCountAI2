import { db } from "@/db/index";
import { z } from "zod";
import { meals } from "@/types"
import { eq, and, sql } from "drizzle-orm";



// * Function to get all a day's meals for a user
export async function POST(Req: Request) {
    try {
        let { userId, date } = await Req.json();
        date = new Date(date).toISOString().slice(0, 10); // "2025-04-20"
        const response = await db.select().from(meals).where(
            and(
                eq(meals.userId, userId),
                sql<boolean>`DATE(${meals.dateTimeAdded}) = ${date}`
            )
        ).orderBy(meals.dateTimeAdded);
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