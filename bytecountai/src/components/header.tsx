import { CircleUserRound } from 'lucide-react';
import { Menu } from 'lucide-react';

export default function Header() {
    return (
        <header className="flex justify-end items-center w-full p-4">
            {/* <h1 className="text-2xl font-bold">ByteCount</h1> */}
            <div className="flex items-center space-x-4">
                <CircleUserRound className="w-6 h-6" />
                <Menu className="w-6 h-6" />
            </div>
        </header>
    );
}