import { Outlet } from 'react-router-dom';
import { MainNav } from './MainNav';

export function AppShell() {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-body">
            <MainNav />
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
