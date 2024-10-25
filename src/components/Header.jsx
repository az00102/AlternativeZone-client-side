import { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from "../providers/AuthProvider";
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

const Header = () => {
    const { user, logOut } = useContext(AuthContext);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        const theme = darkMode ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('theme', theme);
    }, [darkMode]);

    const handleSignOut = () => {
        logOut().then().catch();
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const activeLinkStyle = ({ isActive }) =>
        isActive ? "rounded-none border-r-2 border-l-2 border-[#6CBF40] text-[#6CBF40] font-bold" : "";

    const navLinks = (
        <>
            <li><NavLink to='/' className={activeLinkStyle}>Home</NavLink></li>
            <li><NavLink to='/queries' className={activeLinkStyle}>Queries</NavLink></li>
            {user && <li><NavLink to='/recommendationsforme' className={activeLinkStyle}> Recommendations For Me</NavLink></li>}
            {user && <li><NavLink to='/myqueries' className={activeLinkStyle}>My Queries</NavLink></li>}
            {user && <li><NavLink to='/myrecommendations' className={activeLinkStyle}>My recommendations</NavLink></li>}
        </>
    );

    return (
        <div className="sticky top-0 bg-white dark:bg-gray-800 text-[#008080] dark:text-white z-10">
            <div className="navbar bg-transparent rounded-md flex flex-col md:flex-row md:justify-center lg:flex-row">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white text-black mt-3 z-[1] p-2 shadow rounded-box w-52">
                            {navLinks}
                        </ul>
                    </div>
                    <div className='flex'>
                        <img className='w-12 ml-2 rounded-full border border-[#6CBF40]' src="/favicon.webp" alt="" />
                        <Link to={'/'} className="btn btn-ghost text-lg lg:text-lg font-bold">AlternativeZone</Link>
                    </div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 flex gap-2 font-semibold text-gray-400">
                        {navLinks}
                    </ul>
                </div>
                <div className="lg:navbar-end flex gap-4 items-center">
                    <label htmlFor="Toggle1" className="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-800">
                        <span className='text-black dark:text-white'>Light</span>
                        <span className="relative">
                            <input 
                                id="Toggle1" 
                                type="checkbox" 
                                className="hidden peer" 
                                checked={darkMode} 
                                onChange={toggleTheme} 
                            />
                            <div className="w-10 h-6 rounded-full shadow-inner bg-gray-300 dark:bg-gray-600 peer-checked:bg-[#FF6F61] dark:peer-checked:bg-[#6CBF40]"></div>
                            <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow bg-white dark:bg-gray-100 peer-checked:right-0 peer-checked:left-auto peer-checked:bg-gray-700 dark:peer-checked:bg-gray-200"></div>
                        </span>
                        <span className='text-black dark:text-white'>Dark</span>
                    </label>

                    {user ? (
                        <>
                            <div className="relative border-2 w-max h-max rounded-full border-red-400 group">
                                <img
                                    src={user.photoURL || "/user.png"}
                                    alt="User"
                                    className="w-10 h-10 mx-auto rounded-full"
                                    data-tooltip-content={user.displayName}
                                    data-tooltip-id="my-tooltip"
                                />
                                <Tooltip id="my-tooltip" />
                            </div>
                            <button onClick={handleSignOut} className="btn bg-[#FF6F61] text-white font-semibold lg:w-[116px] border-none">Log Out</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn bg-[#FF6F61] text-white font-semibold lg:w-[116px] border-none">Login</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
