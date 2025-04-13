// Close the sidebar when clicking outside of it
// const sidebar = document.getElementById('sidebar');
// document.addEventListener('click', (e) => {
//     if (sidebar) {
//         if (!sidebar.contains(e.target)) {
//             sidebar.classList.add('-translate-x-full');
//         }
//     }
// })

// Open the sidebar when clicking on the button
export async function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('translate-x-full');
    }
};


export default function Sidebar() {
    return (
        <div className="fixed w-full top-0 right-0 z-50 h-screen overflow-y-auto transition-transform transform translate-x-full ease-in-out duration-300" id="sidebar">
            <aside className="ml-auto h-full shadow-lg dark:shadow-zinc-900 bg-background text-foreground w-4/5 max-w-[400px]">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold">Menu</h1>
                    <button onClick={toggleSidebar}>Close</button>
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