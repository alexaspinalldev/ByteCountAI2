"use client"

import { DatePicker } from "@/app/components/common/ui/datePicker"
import { Label } from "@/app/components/common/ui/label"
import { Progress } from "@/app/components/common/ui/progress"
import { Button } from "@/app/components/common/ui/button"
import ResizableScrollArea from "@/app/components/common/ui/resizeableScrollArea"
import { ChevronLeft, ChevronRight, ChartLine } from "lucide-react"
import MealSkeleton from "../common/ui/mealSkeleton"

import React from 'react';
import { useState, useEffect } from 'react';

import { MealSchema } from '@/types';

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

    return (
        <section className="flex flex-col p-2 md:p-4 w-full h-full border-1 border-gray-400 rounded-2xl">
            <div className="flex justify-between items-center">
                <h2 className="px-2 text-xl md:py-2 md:text-2xl font-bold text-highlight">Daily progress</h2>
                <Button variant="ghost" size="basic" className="text-primary mr-4">
                    {/* // TODO: Launch chart onClick */}
                    <ChartLine className="size-full" />
                </Button>
            </div>
            <div className="flex flex-col justify-center items-center py-2">
                <div className="flex flex-row w-full justify-between items-center">
                    <Button variant="outline" className="mx-2" onClick={decrementDate}>
                        <ChevronLeft />
                    </Button>
                    <DatePicker queryDate={queryDate} setQueryDate={setQueryDate} />
                    <Button variant="outline" className="mx-2" onClick={incementDate}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>
            <ResizableScrollArea>
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
                                    <li key={meal.id} className="flex flex-col p-2 text-muted-foreground w-full max-w-full">
                                        <div className="flex flex-row justify-between items-center w-full text-sm">
                                            <h3 className=" font-semibold">{meal.label}</h3>
                                            <div className="text-muted-foreground">{meal.totalCalories} kcal</div>
                                        </div>
                                        <div className="text-sm max-w-full w-full" style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>{meal.mealBody.map(item => item.label).join(", ")}</div>
                                    </li>
                                ))}
                            </ul>
                        )
                }
            </ResizableScrollArea>
            <div className="p-2">
                <Progress value={progress} className="h-7">
                    {`${userCaloriesConsumed}/${userDailyGoal}`}
                </Progress>
            </div>
        </section >
    )
}