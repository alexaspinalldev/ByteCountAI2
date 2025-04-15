import { CalendarDays } from 'lucide-react';


export default function DayTracker() {
    return (
        <section className="flex flex-col p-2 w-full h-full border-1 border-gray-400 rounded-2xl">
            <div className="flex flex-row justify-between items-center p-2">
                <h2 className="text-xl font-bold">Today</h2>
                <CalendarDays className="text-highlight" />
            </div>
            <h2>Calories</h2>
            <h3>Goal: 2000</h3>
            <h3>Consumed: 1500</h3>
            <h3>Remaining: 500</h3>
            <h2>Meals:</h2>
            <ul>
                <li>Breakfast</li>
                <li>Lunch</li>
                <li>Dinner</li>
            </ul>
        </section>
    )
}