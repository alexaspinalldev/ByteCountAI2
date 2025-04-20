"use client"

import { CalendarDays } from 'lucide-react';

import React from 'react';
import { useState, useEffect } from 'react';

import { meals } from '@/db/index';
type MealSchema = typeof meals.$inferSelect;

export default function DayTracker() {
    const [queryDate, setQueryDate] = useState(new Date()); // Initial value is today
    const [mealsByDay, setMealsByDay] = useState<MealSchema[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchMeals() {
            try {
                setIsLoading(true);
                const response = await fetch('/api/db/getMeals', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: 1, // TODO: Get this from the session
                        date: queryDate
                    }),
                    cache: 'default',
                }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                if (!response.body) {
                    console.error('Response body is null');
                    return;
                }
                const data = await response.json();
                setMealsByDay(data);
                console.log('Fetched meals:', data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Error fetching meals:', error);
            }
        };
        fetchMeals();
    }, [queryDate]); // Fetch meals when the component mounts or when queryDate changes

    // TODO: We'll also use optimistic updates so that the UI updates immediately with mealsToday after the user adds a meal

    const totalDailyCalories = mealsByDay?.reduce((acc, meal) => acc + meal.totalCalories, 0)

    return (
        <section className="flex flex-col p-2 w-full h-full border-1 border-gray-400 rounded-2xl">
            <div className="flex flex-row justify-between items-center p-2">
                <h2 className="text-xl font-bold">Today</h2>
                <CalendarDays className="text-highlight" />
                {/* Day picker which onChange sets setQueryDate */}
            </div>
            {isLoading ? (
                <p className="text-gray-500">Loading...</p>) :
                // Add a skeleton in here when we know what the layout will be
                (
                    <div>
                        {/* Progress bar with labels */}
                        {/* Map over meals by day */}
                        <ul>
                            {mealsByDay.map((meal) => (
                                <li key={meal.id} className="flex flex-row justify-between items-center p-2">
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold">{meal.label}</h3>
                                        {/* <p className="text-gray-500">{`${JSON.parse(meal.mealBody).}`}</p> */}
                                        {/* // TODO: We need to desructure the mealbody */}
                                    </div>
                                    <span className="text-gray-700">{meal.totalCalories} kcal</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </section >
    )
}