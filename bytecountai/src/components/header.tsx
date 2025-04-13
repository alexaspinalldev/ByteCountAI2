"use client";

import { CircleUserRound } from 'lucide-react';

import Sidebar from './sidebar';
import { toggleSidebar } from './sidebar';

export default function Header() {
    return (
        <header>
            <div className="flex justify-end items-center w-full p-4 text-primary relative">
                {/* <h1 className="text-2xl font-bold">ByteCount</h1> */}
                <div className="flex items-center space-x-4">
                    <CircleUserRound className="w-6 h-6" onClick={toggleSidebar} />
                </div>
            </div>
            <Sidebar />
        </header>
    );
}