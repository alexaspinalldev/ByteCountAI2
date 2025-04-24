"use client";
import { ArrowRightFromLine } from 'lucide-react';
import { Button } from '../common/ui/button';

import { useSidebarCtx } from '@/app/components/features/header';

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useSidebarCtx();
    return (
        <div>
            <div className={`${sidebarOpen ? 'fixed top-0' : 'hidden'} absolute w-full h-full z-49 bg-zinc-950 opacity-45`} onClick={() => setSidebarOpen(false)}></div>
            <aside className={`${sidebarOpen ? '' : 'translate-x-full'} overflow-y-auto transition-transform duration-300 ease-in-out transform fixed top-0 right-0 z-50 ml-auto h-full shadow-lg dark:shadow-zinc-900 bg-background text-foreground w-4/5 max-w-[400px] rounded-l-2xl border-1 border-gray-400 border-r-0`}>
                <div className="p-4">
                    <div className='flex items-center justify-between'>
                        <h1 className="text-2xl font-semibold">ByteCount</h1>
                        <Button className='text-primary' size="basic" variant="ghost" onClick={() => setSidebarOpen(false)}>
                            <ArrowRightFromLine className='size-full' />
                        </Button>
                    </div>

                    <ul className="mt-4">
                        <li className="mb-2"><a href="#" className="block hover:text-indigo-400">Account</a></li>
                        <li className="mb-2"><a href="#" className="block hover:text-indigo-400">Hints and tips</a></li>
                        <li className="mb-2"><a href="#" className="block hover:text-indigo-400">Settings</a></li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}