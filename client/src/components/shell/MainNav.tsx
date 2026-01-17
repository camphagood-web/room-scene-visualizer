import { Link, useLocation } from 'react-router-dom';
import { Home, Image, Settings } from 'lucide-react';

export function MainNav() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-primary text-white' : 'text-stone-600 hover:bg-stone-100';
    };

    return (
        <nav className="flex items-center space-x-2 px-4 py-2 bg-white border-b border-stone-200">
            <Link to="/" className="flex items-center space-x-2 font-heading font-bold text-xl text-primary mr-8">
                <Home className="w-6 h-6" />
                <span>Room Viz</span>
            </Link>

            <Link to="/" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${isActive('/')}`}>
                <Settings className="w-5 h-5" />
                <span>Generator</span>
            </Link>

            <Link to="/gallery" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${isActive('/gallery')}`}>
                <Image className="w-5 h-5" />
                <span>Gallery</span>
            </Link>
        </nav>
    );
}
