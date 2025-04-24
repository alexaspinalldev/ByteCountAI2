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
                <div className="relative flex items-center justify-end w-full px-3 py-2 text-primary">
                    <Button className="flex items-center space-x-4" variant="ghost" size="basic" onClick={() => setSidebarOpen(prev => !prev)} >
                        <CircleUserRound className='size-full' />
                    </Button>
                </div>
                <Sidebar />
            </header>
        </SidebarCtx.Provider>

    );
}