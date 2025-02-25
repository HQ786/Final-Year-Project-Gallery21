import React from 'react'
import { signOut } from 'next-auth/react';
import { X } from 'lucide-react';
import { FaCaretDown } from 'react-icons/fa';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';


const ProfileDropdown = ({ user,  profileImage, router }) => {
    
    const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleProfileDropdown = () => setProfileDropdownOpen(!isProfileDropdownOpen);
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setProfileDropdownOpen(false);
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [setProfileDropdownOpen]);
      

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    return (
        <div>
            {/* Profile Dropdown */}
            <div className="relative">
                <div className="flex  items-center gap-1 cursor-pointer" onClick={toggleProfileDropdown}>
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="rounded-full w-8 h-8 border-2 border-[#FCE1E0] dark:border-gray-700"
                    />
                    <FaCaretDown className="w-3 h-3" />
                </div>

                <div
                    className={`absolute -top-2 right-0 mt-2 bg-white dark:bg-nft-black-1 shadow-lg rounded-lg z-50 w-48
transform transition-all duration-300 ease-in-out ${isProfileDropdownOpen
                            ? 'scale-100 opacity-100 visible'
                            : 'scale-95 opacity-0 invisible'
                        }`}
                    ref={dropdownRef}
                >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-500 relative">
                        <button
                            onClick={toggleProfileDropdown}
                            className="absolute top-2 right-2 text-gray-400 dark:text-gray-200 hover:text-gray-600 transition-[color] duration-200"
                        >
                            <X size={18} />
                        </button>
                        <div className="flex items-center gap-2 pr-6">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="rounded-full w-12 h-12 border-2 dark:border-gray-700 border-gray-300"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-200">@{user?.username}</span>
                        </div>
                    </div>

                    <nav className="py-2">
                        {user ? <>
                            <Link
                                href={`/${user?.username}`}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-nft-black-4 transition-colors"
                                onClick={toggleProfileDropdown}
                            >
                                Profile
                            </Link>
                            <Link
                                href={`/${user?.username}/settings`}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-nft-black-4 transition-colors"
                                onClick={toggleProfileDropdown}
                            >
                                Settings
                            </Link>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent navigation since we're using this as a button
                                    handleLogout(); // Call the logout function
                                    toggleProfileDropdown(); // Close the dropdown
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-nft-black-4 transition-colors"
                            >
                                Logout
                            </Link>
                            <ThemeToggle />

                        </> : (
                            <p className="text-gray-500 dark:text-gray-200 text-sm px-4 py-2">Please log in to access these options.</p>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default ProfileDropdown
