'use client';

import { FaHome, FaStore, FaBell, FaPlus, FaBars, FaPen, FaPaintBrush, FaLandmark } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { fetchUserProfile } from '@lib/fetchUserProfile';
import logo from '@public/logo.jpg';
import ProfileDropdown from '@components/ProfileDropdown';
import Search from './Search';
import NFTButton from './NFTButton';

function DashboardLayout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState('/assets/nft5.png');

  useEffect(() => {
    if (status === 'loading') return;

    else {
      if (status === 'authenticated') {
        fetchUserProfile(session?.user?.id, setUser, setProfileImage);
      }
    }
  }, [session, status, router]);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);
  const toggleNotificationCard = () => setNotificationOpen(!isNotificationOpen);


  // Navigation items configuration
  const navigationItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/auctions', icon: FaLandmark, label: 'Auctions' },
    { path: '/marketplace', icon: FaStore, label: 'Marketplace' },
    { path: '/canvas', icon: FaPen, label: 'Digital Canvas' },
    { path: '/create-artwork', icon: FaPaintBrush, label: 'Create Artwork' },
    { path: 'http://localhost:3001', icon: NFTButton, label: 'NFT Marketplace'}
  ];



  return (
    <div className="min-h-screen flex flex-col dark:bg-deviantBlack">
      <div
        className="top-0 left-0 right-0 fixed z-50 p-4 blur-background dark:!backdrop-filter-none dark:bg-nft-black-3 text-white flex justify-between items-center shadow-lg"
      >
        <div className="flex items-center space-x-4 px-1">
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <FaBars className=" text-[#E30014] w-4 h-4" />
          </button>
          <div className="flex flex-row">
            <div>
              <Image src={logo} alt="Logo" width={64} height={64} className="w-10 h-auto px-2" />
            </div>
            <h3 className="text-[#ee4f5d] dark:text-slate-300 text-2xl font-thin">Gallery21</h3>
          </div>
        </div>
        {/* <div className="relative w-52 flex-grow">
            <input
              title='Search'
              type="text"
              className="p-1 pl-8 pr-4 text-white rounded-xl bg-[#ee4f5d] dark:bg-purple-600 placeholder:text-white text-sm font-thin border-2 border-transparent focus:outline-none w-44 transition-all duration-300 focus:w-52  shadow-lg"
              placeholder="Search"
              spellCheck={false}
              maxLength={64}
            />
            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-[white]">
              <Search width={20} />
            </div>
          </div> */}

        {/* Notification Button */}
        <div className="flex items-center justify-between relative space-x-4">
          {/* <div className='relative'>
          <Search />
          </div>           */}
          {/* <button
            onClick={toggleNotificationCard}
            title='Notifications'
            className="bg-[#E30014] hover:bg-[#ff3546] dark:bg-slate-200 dark:text-gray-800 p-1 dark:hover:bg-gray-800 active:bg-gray-950 rounded-md hover:border-white 
            transition-colors duration-200 relative"
            aria-label="Notifications"
          >
            <FaBell className="w-4 h-4" />
            {isNotificationOpen && (
              <div className="absolute right-4 top-6 mt-2 bg-white dark:bg-nft-black-1 shadow-lg rounded-lg z-50 w-fit">
                <div className="p-4 text-sm text-gray-600 dark:text-gray-200">No notifications</div>
              </div>
            )}
          </button> */}
          {(session?.user?.roles?.includes('Artist')) &&

            <button onClick={() => {
              router.push('/create-artwork')
            }} title='Create artwork' className="bg-[#E30014] hover:bg-[#ff3546] p-1 dark:bg-slate-200 dark:text-gray-800 dark:hover:bg-gray-800 active:bg-gray-950 rounded-md">
              <FaPlus className="w-4 h-4" />
            </button>
          }
          <ProfileDropdown user={user} profileImage={profileImage} router={router} />


        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 dark:bg-deviantBlack">
        {/* Sidebar */}
        <div
          className={`bg-[#f5ebeb] gap-y-2 shadow-xl fixed z-40 top-[64px] h-[calc(100vh-64px)]  dark:!backdrop-filter-none dark:bg-nft-black-3 flex items-center flex-col py-4 space-y-4 transition-all duration-300 ${isSidebarExpanded ? 'w-44' : 'w-14'}`}
        >
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-[#e13b49] bg-white shadow-lg group hover:bg-slate-200 flex items-center justify-start transition-all duration-300 p-1 rounded-lg ${isSidebarExpanded ? 'w-40' : 'w-8'
                }`}
            >
              <div className="flex items-center">
                <item.icon
                  className={`group-hover:text-[#E30014] transition-all duration-500 
                  ${isSidebarExpanded ? 'text-2xl' : 'text-xl'} 
                  ${pathname === item.path ? 'text-blue-400 dark:text-purple-400' : ''}`}
                />
                {isSidebarExpanded && (
                  <span
                    className={`group-hover:text-[#E30014] text-sm ml-4 transition-opacity duration-700 delay-700 ease-in-out 
                    ${pathname === item.path ? 'text-blue-400 dark:text-purple-400' : ''} 
                    ${isSidebarExpanded ? 'opacity-100 visible' : 'opacity-0 invisible delay-0'}`}
                     >
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div
          className={`bg-[#FCE1E0] dark:bg-deviantBlack flex-1 min-h-[calc(100vh-64px)] overflow-hidden
               ${(isSidebarExpanded ? 'ml-44 mt-[64px]' : 'ml-14 mt-[64px]')}`} >

          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

// 'use client';

// import { FaHome, FaEye, FaStore, FaBell, FaPlus, FaBars, FaPen, FaCaretDown, FaPaintBrush } from 'react-icons/fa';
// import logo from '../../public/logo.jpg';
// import { useState, useEffect, Suspense } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import Home from './page';
// import Marketplace from '../stripe-marketplace/page';
// import CreateArtwork from '../create-work/page';
// import DigitalCanvas from '../../components/ImageEditor';
// import Profile from './[username]/profile/page';
// import Settings from './[username]/settings/page';
// import CreatePost from './[username]/create-post/page';
// import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// import { useSession, signOut } from "next-auth/react";
// import Loader from '@components/Loader';
// import { fetchUserProfile } from '@lib/fetchUserProfile';
// import { X } from 'lucide-react';

// function DashboardContent() {
//   const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
//   const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [isNotificationOpen, setNotificationOpen] = useState(false);
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const tab = searchParams.get('tab');
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState('/assets/nft5.png');


//   useEffect(() => {
//     if (status === 'loading') return; // Wait for session to load
//     if (!session) {
//       router.push('/login'); // Redirect to sign-in if not authenticated
//     } else {
//       fetchUserProfile(session.user.id, setUser, setProfileImage);
//     }
//   }, [session, status]);

//   const handleNavigation = (newTab) => {
//     router.push(`/dashboard?tab=${newTab}`);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarExpanded(!isSidebarExpanded);
//   };

//   const toggleProfileDropdown = () => {
//     setProfileDropdownOpen(!isProfileDropdownOpen);
//   };

//   const toggleNotificationCard = () => {
//     setNotificationOpen(!isNotificationOpen);
//   };

//   const handleLogout = async () => {
//     await signOut({ redirect: false });
//     router.push("/login");
//   };

//   // Dynamic content rendering based on the current path
//   const renderContent = () => {
//     if (pathname === `/dashboard/${user?.username}/profile` ) {
//       return <Profile />;
//     }

//     if (pathname === `/dashboard/${user?.username}/settings`) {
//       return <Settings />;
//     }

//     if (pathname === `/dashboard/${user?.username}/create-post`) {
//       return <CreatePost />;
//     }

//     switch (tab) {
//       case 'home':
//         return <Home />;
//       case 'create-post':
//         return <div>Watch page content goes here.</div>;
//       case 'marketplace':
//         return <Marketplace />;
//       case 'digital-canvas':
//         return <DigitalCanvas />;
//       case 'create-artwork':
//         return <CreateArtwork />;
//       default:
//         return <Home />;
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Top Bar */}
//       <div
//         className="top-0 left-0 right-0 fixed z-50 p-4 text-white flex justify-between items-center"
//         style={{
//           backdropFilter: 'saturate(180%) blur(5px)',
//           backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         }}
//       >
//         <div className="flex items-center space-x-4 px-1">
//           <button onClick={toggleSidebar} className="text-white focus:outline-none">
//             <FaBars className="w-4 h-4" />
//           </button>
//           <div className="flex flex-row">
//             <div>
//               <Image src={logo} alt="Logo" width={64} height={64} className="w-10 h-auto px-2" />
//             </div>
//             <h3 className='text-xl font-bold'>Gallery21</h3>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4 relative">
//           <button
//             onClick={toggleNotificationCard}
//             className="p-1 hover:bg-gray-800 active:bg-gray-950 rounded-md hover:border-white
//             transition-colors duration-200 relative"
//             aria-label="Notifications"
//           >
//             <FaBell className="w-4 h-4" />
//             {/* Notification Dropdown */}
//             <div
//               className={`absolute right-4 top-6 mt-2 bg-white shadow-lg rounded-lg z-50 overflow-hidden transform transition-all duration-300 ease-in-out origin-top-right w-fit ${isNotificationOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
//                 }`}
//             >
//               <div className="p-4 text-sm text-gray-600">
//                 No notifications
//               </div>
//             </div>
//           </button>

//           <button className='p-1 hover:bg-gray-800 active:bg-gray-950 rounded-md'>
//             <FaPlus className="w-4 h-4"/>
//           </button>
//           <input
//             type="text"
//             className="p-1 rounded-xl bg-[#3e3e3e] text-xs border-2 border-transparent focus:outline-none"
//             placeholder="Search"
//           />
//           <div className="relative">
//             <div className="flex items-center gap-1 cursor-pointer" onClick={toggleProfileDropdown}>
//               <img
//                 src={profileImage}
//                 alt="Profile"
//                 className="rounded-full w-8 h-8 border-2 border-gray-300"
//               />
//               <FaCaretDown className="w-3 h-3" />
//             </div>

//             {/* Dropdown Menu */}
//             <div
//               className={`absolute -top-2 right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out origin-top-right z-50 w-48 ${isProfileDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
//                 }`}
//             >
//               <div className="p-3 border-b border-gray-100 relative">
//                 <button
//                   onClick={toggleProfileDropdown}
//                   className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-[color] duration-200"
//                   aria-label="Close dropdown"
//                 >
//                   <X size={18} />
//                 </button>

//                 {/* Profile info */}
//                 <div className="flex items-center gap-2 pr-6"> {/* Added right padding to prevent overlap with close button */}
//                   <img
//                     src={profileImage}
//                     alt="Profile"
//                     className="cursor-pointer rounded-full w-12 h-12 border-2 border-gray-300"
//                     onClick={toggleProfileDropdown}
//                   />
//                   <span className="text-sm text-gray-600">@{user?.username}</span>
//                 </div>
//               </div>

//               <nav className="py-2">
//                 <Link
//                   href={`/dashboard/${user?.username}/profile`}
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
//                   onClick={toggleProfileDropdown}
//                 >
//                   Profile
//                 </Link>
//                 <Link
//                   href={`/dashboard/${user?.username}/settings`}
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
//                   onClick={toggleProfileDropdown}
//                 >
//                   Settings
//                 </Link>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     toggleProfileDropdown();
//                   }}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
//                 >
//                   Logout
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         {status === "authenticated" &&
//           <div
//             className={`fixed z-40 top-[64px] h-[calc(100vh-64px)] bg-[#000000] opacity-80 flex items-center flex-col py-4 space-y-4 transition-all duration-300 ${isSidebarExpanded ? 'w-44' : 'w-14'}`}
//           >
//             {/* Home Button */}
//             <button
//               onClick={() => handleNavigation('home')}
//               className={`text-white group hover:bg-slate-200 flex items-center justify-start transition-all duration-300 p-1 rounded-lg ${isSidebarExpanded ? 'w-40' : 'w-8'}`}
//             >
//               <FaHome className={`group-hover:text-black text-xl transition-all duration-300 ${isSidebarExpanded ? 'text-2xl' : 'text-xl'} ${tab === 'home' ? 'text-orange-400 w-7 h-7' : ''}`} />
//               {isSidebarExpanded && <span className="group-hover:text-black text-sm ml-4">Home</span>}
//             </button>

//             {/* Create Post */}
//             <button
//               onClick={() => handleNavigation('create-post')}
//               className={`text-white group hover:bg-slate-200 flex items-center justify-start transition-all duration-300 p-1 rounded-lg ${isSidebarExpanded ? 'w-40' : 'w-8'}`}
//             >
//               <FaEye className={`group-hover:text-black text-xl transition-all duration-300 ${isSidebarExpanded ? 'text-2xl' : 'text-xl'} ${tab === 'create-post' ? 'text-orange-400 w-7 h-7' : ''}`} />
//               {isSidebarExpanded && <span className="group-hover:text-black text-sm ml-4">Watch</span>}
//             </button>

//             {/* Marketplace Button */}
//             <button
//               onClick={() => handleNavigation('marketplace')}
//               className={`group hover:bg-slate-200 text-white flex items-center justify-start transition-all duration-300 p-1 rounded-lg ${isSidebarExpanded ? 'w-40' : 'w-8'}`}
//             >
//               <FaStore className={`group-hover:text-black text-xl transition-all duration-300 ${isSidebarExpanded ? 'text-2xl' : 'text-xl'} ${tab === 'marketplace' ? 'text-orange-400 w-7 h-7' : ''}`} />
//               {isSidebarExpanded && <span className="group-hover:text-black text-sm ml-4">Marketplace</span>}
//             </button>

//             {/* Digital Canvas Button */}
//             <button
//               onClick={() => handleNavigation('digital-canvas')}
//               className={`group hover:bg-slate-200 text-white flex items-center justify-start transition-all duration-300 p-1 rounded-lg  ${isSidebarExpanded ? 'w-40' : 'w-8'}`}
//             >
//               <FaPen className={`group-hover:text-black text-xl transition-all duration-300 ${isSidebarExpanded ? 'text-2xl' : 'text-xl'} ${tab === 'digital-canvas' ? 'text-orange-400 w-7 h-7' : ''}`} />
//               {isSidebarExpanded && <span className="group-hover:text-black text-sm ml-4">Digital Canvas</span>}
//             </button>

//             {/* Create Artwork Button */}
//             {
//               <button
//                 onClick={() => handleNavigation('create-artwork')}
//                 className={`group hover:bg-slate-200 text-white flex items-center justify-start transition-all duration-300 p-1 rounded-lg ${isSidebarExpanded ? 'w-40' : 'w-8'}`}
//               >
//                 <FaPaintBrush
//                   className={`group-hover:text-black text-xl transition-all duration-300 ${isSidebarExpanded ? 'text-2xl' : 'text-xl'} ${tab === 'create-artwork' ? 'text-red-500' : ''}`}
//                 />
//                 {isSidebarExpanded && <span className="group-hover:text-black text-sm ml-4 ">Create Artwork</span>}
//               </button>
//             }
//           </div>
//         }

//         {/* Main Content */}
//         <div
//           className={`flex-1 min-h-[calc(100vh-64px)]  mt-[64px] ${status === "authenticated" ? (isSidebarExpanded ? 'ml-44' : 'ml-14') : 'ml-0'
//             }`}
//         >
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function DashboardLayout({ children }) {
//   return (
//     <Suspense fallback={<Loader />}>
//       <DashboardContent />
//     </Suspense>
//   );
// }

// import React from 'react'

// const layout = ({children}) => {
//   return (
//     <div>
//       {children}
//     </div>
//   )
// }

// export default layout
