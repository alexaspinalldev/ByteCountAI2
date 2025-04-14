"use client";

import { CircleUserRound } from 'lucide-react';
import { useState, createContext, useContext } from 'react';
import Sidebar from './sidebar';

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
                <div className="relative flex items-center justify-end w-full p-4 text-primary">
                    {/* <h1 className="text-2xl font-bold">ByteCount</h1> */}
                    <button className="flex items-center space-x-4">
                        <CircleUserRound className="w-6 h-6" onClick={() => setSidebarOpen(prev => !prev)} />
                    </button>
                </div>
                <Sidebar />
            </header>
        </SidebarCtx.Provider>

    );
}