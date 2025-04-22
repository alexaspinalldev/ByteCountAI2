"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@//app/components/common/ui/button"
import { Calendar } from "@/app/components/common/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/components/common/ui/popover"

export function DatePicker({ queryDate, setQueryDate }: { queryDate: Date, setQueryDate: React.Dispatch<React.SetStateAction<Date>> }) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-center text-center font-normal",
                        !queryDate && "text-muted-foreground"
                    )}
                >
                    {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                    {queryDate ? format(queryDate, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={queryDate}
                    onSelect={(day) => { if (day) { setQueryDate(day) } }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
