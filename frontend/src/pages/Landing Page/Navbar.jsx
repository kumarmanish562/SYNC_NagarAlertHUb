import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    // Helper to handle scrolling if on home, or navigating then scrolling
    const handleNavigation = (e, targetId) => {
        e.preventDefault();
        if (location.pathname === '/') {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(`/#${targetId}`);
        }
    };

    const [isDarkMode, setIsDarkMode] = React.useState(false);

    React.useEffect(() => {
        // Check local storage or system preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    const isDashboard = location.pathname === '/dashboard';

    const isAuthPage = ['/login', '/signup', '/forgot-password'].some(path => location.pathname.toLowerCase().startsWith(path));

    return (
        <nav className="sticky top-0 z-50 bg-[#1a36ca] dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between shadow-lg transition-colors duration-300">
            <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 transition-colors">
                    <span className="text-[#1a36ca] dark:text-blue-400 font-bold text-xl">⚡</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold leading-tight">नगर Alert Hub</h1>
                    <span className="text-xs opacity-80 font-light">Civic Intelligence Platform</span>
                </div>
            </Link>

            {!isDashboard && (
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link to="/" className="hover:text-blue-200 dark:hover:text-blue-400 transition-colors">Home</Link>
                    <a href="/#features" onClick={(e) => handleNavigation(e, 'features')} className="hover:text-blue-200 dark:hover:text-blue-400 transition-colors cursor-pointer">Features</a>
                    <a href="/#whatsapp" onClick={(e) => handleNavigation(e, 'whatsapp')} className="hover:text-blue-200 dark:hover:text-blue-400 transition-colors cursor-pointer">WhatsApp Integration</a>
                    <a href="/#about" onClick={(e) => handleNavigation(e, 'about')} className="hover:text-blue-200 dark:hover:text-blue-400 transition-colors cursor-pointer">About</a>
                </div>
            )}

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-800/50 dark:bg-slate-800 rounded-full hover:bg-blue-800 dark:hover:bg-slate-700 transition-colors border border-blue-700/50 dark:border-slate-700 text-sm cursor-pointer"
                >
                    {isDarkMode ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                            <span>Light</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </svg>
                            <span>Dark</span>
                        </>
                    )}
                </button>

                {isDashboard ? (
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/20">
                            JD
                        </div>
                        <Link to="/" className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm">
                            Logout
                        </Link>
                    </div>
                ) : !isAuthPage ? (
                    <Link to="/login" className="bg-[#f97316] hover:bg-[#ea580c] text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-lg hover:shadow-orange-500/20 text-sm">
                        Login / Sign Up
                    </Link>
                ) : null}
            </div>
        </nav>
    );
}
