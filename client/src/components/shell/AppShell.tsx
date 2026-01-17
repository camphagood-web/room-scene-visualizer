import { Outlet } from 'react-router-dom';
import { MainNav } from './MainNav';
import { ThemeProvider } from '../theme/ThemeProvider';

export function AppShell() {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 font-body transition-colors duration-300">
                <MainNav />
                <main className="container mx-auto px-4 py-8">
                    <Outlet />
                </main>
            </div>
        </ThemeProvider>
    );
}
