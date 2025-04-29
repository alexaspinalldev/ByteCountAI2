"use client";

import { CircleUserRound } from 'lucide-react';
import { useState, createContext, useContext } from 'react';
import Sidebar from './sidebar';
import { Button } from '../common/ui/button';

const SidebarCtx = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

export function useSidebarCtx() {
    const ctx = useContext(SidebarCtx);
    if (!ctx) throw new Error("SidebarCtx must be called inside this component");
    return ctx;
}

export default function Header() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <SidebarCtx.Provider value={[sidebarOpen, setSidebarOpen]}>
            <header>
                <div className="mt-3 mr-3 md:m-0 fixed md:relative right-0 flex items-center justify-end w-fit md:w-full pl-2 pb-2 md:pl-0 md:pb-0 md:pt-3 md:pr-3 text-primary bg-background border-b-1 border-l-1 border-gray-400 md:border-none z-20 rounded-bl-3xl md:rounded-none"
                // style={{ clipPath: 'inset(0px 12px 0px 0px)' }}
                >
                    <Button className="flex items-center space-x-4 -mr-2 -mt-2 md:m-0" variant="ghost" size="basic" onClick={() => setSidebarOpen(prev => !prev)} >
                        <CircleUserRound className='size-full' />
                    </Button>
                </div>
                <Sidebar />
            </header>
        </SidebarCtx.Provider>

    );
}