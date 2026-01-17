import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        // If current is system, we need to resolve it first or just cycle.
        // Simple cycle: light -> dark -> light
        // If user prefers system, they can clear storage or we can add a 3rd state later.
        // For this simple toggle, we'll switch between light/dark.
        if (theme === 'dark') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className="group grid h-9 w-9 place-items-center rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Toggle theme"
        >
            <Sun className="col-start-1 row-start-1 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-stone-900 dark:text-stone-100" />
            <Moon className="col-start-1 row-start-1 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-stone-900 dark:text-stone-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
