"use client"

import { DatePicker } from "@/app/components/common/ui/datePicker"
import { Progress } from "@/app/components/common/ui/progress"
import { Button } from "@/app/components/common/ui/button"
import { ScrollArea } from "@/app/components/common/ui/scroll-area"
import { ChevronLeft, ChevronRight, ChartLine } from "lucide-react"
import MealSkeleton from "../common/ui/mealSkeleton"

import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { meals } from '@/db/index';
type MealSchema = Omit<typeof meals.$inferSelect, 'mealBody'> & { mealBody: Fooditem[] };
import { Fooditem } from './mealInput';
// TODO: Create a central type file


export default function DayTracker() {
    const [queryDate, setQueryDate] = useState(new Date()); // Initial value is today
    const [mealsByDay, setMealsByDay] = useState<MealSchema[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [progress, setProgress] = useState(0);

    const userDailyGoal = 2000; // TODO: Get this from the session
    const userCaloriesConsumed = mealsByDay?.reduce((acc, meal) => acc + meal.totalCalories, 0)
    const userCalorieGoalProgress = Math.min(userCaloriesConsumed / userDailyGoal, 1) * 100;

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
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Error fetching meals:', error);
            }
        };
        fetchMeals();
    }, [queryDate]); // Fetch meals when the component mounts or when queryDate changes
    // TODO: We'll also use optimistic updates so that the UI updates immediately with mealsToday after the user adds a meal

    useEffect(() => {
        setTimeout(() => {
            setProgress(userCalorieGoalProgress);
        }, 100); // Delay the progress update to allow for initial value to animate
    }, [userDailyGoal, userCalorieGoalProgress]);

    function incementDate() {
        const newDate = new Date(queryDate);
        newDate.setDate(newDate.getDate() + 1);
        setQueryDate(newDate);
    }

    function decrementDate() {
        const newDate = new Date(queryDate);
        newDate.setDate(newDate.getDate() - 1);
        setQueryDate(newDate);
    }

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
        <section className="flex flex-col p-2 md:p-4 w-full h-full border-1 border-gray-400 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
                <h2 className="p-2 text-2xl font-bold text-highlight">Daily progress</h2>
                <ChartLine className="w-8 h-8 text-primary mr-4" />
            </div>
            <div className="flex flex-col justify-center items-center p-2">
                <div className="flex flex-row">
                    <Button variant="outline" className="mx-2" onClick={decrementDate}>
                        <ChevronLeft />
                    </Button>
                    <DatePicker queryDate={queryDate} setQueryDate={setQueryDate} />
                    <Button variant="outline" className="mx-2" onClick={incementDate}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>
            <div className="p-2">
                <Progress value={progress} />
            </div>
            <div className="grow bg-amber-300" ref={scrollAreaContainer}>
                {/* ^Used to explicity set the heght of the ScrollArea */}
                {/* <ScrollArea className="py-2 bg-gray-100 dark:bg-zinc-900" style={{ height: `${scrollAreaHeight}px` }}>
                    {isLoading ? (
                        <ul>
                            <MealSkeleton />
                            <MealSkeleton />
                            <MealSkeleton />
                        </ul>) :
                        mealsByDay.length === 0 ?
                            (<ul>
                                <li className="p-2 text-muted-foreground">
                                    <h3 className="text-base font-semibold">No meals logged today</h3>
                                </li>
                            </ul>) :
                            (
                                <ul>
                                    {mealsByDay.map((meal) => (
                                        <li key={meal.id} className="flex flex-col p-2 text-muted-foreground">
                                            <div className="flex flex-row justify-between items-center">
                                                <h3 className="text-base font-semibold">{meal.label}</h3>
                                                <div className="text-muted-foreground">{meal.totalCalories} kcal</div>
                                            </div>
                                            <span className='text-base text-nowrap overflow-hidden'>{`${meal.mealBody.map(item => item.label).join(", ").slice(0, 40)}...`}</span>
                                        </li>
                                    ))}
                                </ul>
                            )
                    }
                </ScrollArea> */}
            </div>
        </section >
    )
}