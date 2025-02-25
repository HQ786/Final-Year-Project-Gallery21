// 'use client'
// import React, { useState, useEffect } from "react";
// import toast from "react-hot-toast"; // Import your toast library for notifications

// export default function Settings() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [lastUsernameChange, setLastUsernameChange] = useState(null); // Date of last username change
//   const [usernameChangeAllowed, setUsernameChangeAllowed] = useState(true); // Allow changing username

//   useEffect(() => {
//     // Fetch user data and set state (replace with your fetching logic)
//     const fetchUserData = async () => {
//       // Example fetch call to your API
//       const response = await fetch("/api/user/me");
//       const data = await response.json();
//       setUsername(data.username);
//       setEmail(data.email);
//       setLastUsernameChange(data.lastUsernameChange); // Assuming the date is provided from the server
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     // Check if the username can be changed based on the last change date
//     if (lastUsernameChange) {
//       const lastChangeDate = new Date(lastUsernameChange);
//       const now = new Date();
//       const oneWeekLater = new Date(lastChangeDate);
//       oneWeekLater.setDate(lastChangeDate.getDate() + 7);

//       setUsernameChangeAllowed(now >= oneWeekLater);
//     }
//   }, [lastUsernameChange]);

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   // Handle username change
//   if (username !== "") {
//     if (!usernameChangeAllowed) {
//       toast.error("You can only change your username once per week.");
//       return;
//     }
//     // Update username logic
//     await updateUserData({ username });
//   }

//   // Handle email change
//   if (email !== "") {
//     await updateUserData({ email });
//   }

//   // Handle password change
//   if (password !== "") {
//     await updateUserData({ password });
//   }

//   // Notify user
//   toast.success("User settings updated successfully!");
// };

// const updateUserData = async (data) => {
//   try {
//     const response = await fetch("/api/user/update", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update user data.");
//     }

//     // Update the last username change date if the username was changed
//     if (data.username) {
//       setLastUsernameChange(new Date());
//     }

//     return response.json();
//   } catch (error) {
//     toast.error(error.message);
//   }
// };

//   const handleDeleteAccount = async () => {
//     const hasConfirmed = window.confirm("Are you sure you want to delete your account?");
//     if (hasConfirmed) {
//       try {
//         const response = await fetch("/api/user/delete", {
//           method: "DELETE",
//         });

//         if (response.ok) {
//           toast.success("Account deleted successfully.");
//           // Handle logout or redirect logic here
//         } else {
//           throw new Error("Failed to delete account.");
//         }
//       } catch (error) {
//         toast.error(error.message);
//       }
//     }
//   };

//   return (
//     <div className="bg-slate-100 p-4 shadow-md rounded-lg mb-4 w-full">
//       <h2 className="text-lg font-semibold mb-4">User Settings</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700">Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="border rounded-md p-2 w-full"
//             disabled={!usernameChangeAllowed}
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border rounded-md p-2 w-full"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border rounded-md p-2 w-full"
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white rounded-md p-2 mt-4"
//         >
//           Update Settings
//         </button>
//       </form>
//       <button
//         onClick={handleDeleteAccount}
//         className="text-red-600 mt-4"
//       >
//         Delete Account
//       </button>
//     </div>
//   );
// }

// 'use client'
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { useSession } from 'next-auth/react';

// export default function Settings() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [lastUsernameChange, setLastUsernameChange] = useState(null);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [usernameChangeAllowed, setUsernameChangeAllowed] = useState(true);
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     // Fetch user data and set state (replace with your fetching logic)
//     const fetchUserData = async () => {
//       // Example fetch call to your API
//       const response = await fetch("/api/user/me");
//       const data = await response.json();
//       setUsername(data.username);
//       setEmail(data.email);
//       setLastUsernameChange(data.lastUsernameChange); // Assuming the date is provided from the server
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     // Check if the username can be changed based on the last change date
//     if (lastUsernameChange) {
//       const lastChangeDate = new Date(lastUsernameChange);
//       const now = new Date();
//       const oneWeekLater = new Date(lastChangeDate);
//       oneWeekLater.setDate(lastChangeDate.getDate() + 7);

//       setUsernameChangeAllowed(now >= oneWeekLater);
//     }
//   }, [lastUsernameChange]);

//   const deleteAccount = async () => {
//     const hasConfirmed = window.confirm("Are you sure you want to delete your account?");
//     if (hasConfirmed) {
//       try {
//         const response = await fetch(`/api/user/${session?.user?.id}`, {
//           method: "DELETE",
//         });

//         if (response.ok) {
//           toast.success("Account deleted successfully.", { icon: '✅' });
//           // Handle logout or redirect logic here
//         } else {
//           throw new Error("Failed to delete account.");
//         }
//       } catch (error) {
//         toast.error(error.message);
//       }
//     }
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const dataToUpdate = {}; // Object to hold fields to update

//     // Handle username change
//     if (username !== "") {
//       if (!usernameChangeAllowed) {
//         toast.error("You can only change your username once per week.");
//         return;
//       }
//       dataToUpdate.username = username; // Add username to the update data
//     }

//     // Handle email change
//     if (email !== "") {
//       dataToUpdate.email = email; // Add email to the update data
//     }

//     // Handle password change
//     if (password !== "") {
//       dataToUpdate.password = password; // Add password to the update data
//     }

//     // Update user data
//     await updateUserData(dataToUpdate);

//     // Notify user
//     toast.success("User settings updated successfully!");
//   };

//   const updateUserData = async (data) => {
//     try {
//       const response = await fetch(`/api/user/update/${userId}`, { // Assuming userId is defined in your component
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update user data.");
//       }

//       return response.json();
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };


//   const handleDeleteAccount = () => {
//     toast.custom((t) => (
//       <div className={`toast ${t.visible ? 'animate-enter' : 'animate-leave'}`} style={{ backgroundColor: '#f8d7da', padding: '1rem', borderRadius: '8px', zIndex: 9999 }}>
//         <div className="flex justify-between items-center z-40">
//           <span className="text-gray-800">Are you sure you want to delete your account? This action cannot be undone.</span>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => {
//                 deleteAccount();
//               }}
//             >
//               Yes
//             </button>
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id); // Dismiss the confirmation toast
//                 toast.success("Account deletion cancelled.", { id: 'delete-cancel-toast' });
//               }}
//               className="bg-gray-300 p-1 rounded"
//             >
//               No
//             </button>
//           </div>
//         </div>
//       </div>
//     ));
//   };


//   return (
//     <div className="bg-slate-100 p-6 shadow-md rounded-lg mb-4 w-full max-w-lg mx-auto">
//       <h2 className="text-xl font-semibold mb-6 text-center">User Settings</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-gray-700 mb-1">Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className={`border rounded-md p-2 w-full ${!usernameChangeAllowed ? "bg-gray-200" : "bg-white"}`}
//             disabled={!usernameChangeAllowed}
//             placeholder="Enter your username"
//             required
//           />
//           <p className="text-gray-500 text-xs mt-1">
//             You can change your username once a week.
//           </p>
//         </div>
//         <div>
//           <label className="block text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border rounded-md p-2 w-full bg-white"
//             placeholder="Enter your email"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 mb-1">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border rounded-md p-2 w-full bg-white"
//             placeholder="Enter your password"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white rounded-md p-2 mt-4 w-full flex justify-center items-center"
//           disabled={submitLoading}
//         >
//           {submitLoading ? (
//             <>
//               <span className="loader mr-2" /> {/* Add a loader here */}
//               Updating...
//             </>
//           ) : (
//             "Update Settings"
//           )}
//         </button>
//       </form>
//       <button
//         onClick={handleDeleteAccount}
//         className="text-red-600 mt-4 w-full text-center hover:underline"
//       >
//         Delete Account
//       </button>
//     </div>
//   );
// }

'use client'
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function UserSettings() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [usernameChangeAllowed, setUsernameChangeAllowed] = useState(true); // Adjust according to your logic
  const { data: session, status } = useSession();

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!usernameChangeAllowed) {
      toast.error("You can only change your username once per week.");
      return;
    }

    try {
      setUsernameLoading(true);
      const response = await fetch(`/api/user/${session?.user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Failed to update username.');
      }
      setUsername('')

      toast.success('Username updated successfully!');
      setUsernameChangeAllowed(false); // Update logic if necessary
      // Optionally update the last username change date here
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      setEmailLoading(true);
      const response = await fetch(`/api/user/${session?.user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to update email.');
      }
      setEmail('')

      toast.success('Email updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      setPasswordLoading(true);
      const response = await fetch(`/api/user/${session?.user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password.');
      }
      setPassword('')
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = () => {
        toast.custom((t) => (
          <div className={`toast ${t.visible ? 'animate-enter' : 'animate-leave'}`} style={{ backgroundColor: '#f8d7da', padding: '1rem', borderRadius: '8px', zIndex: 9999 }}>
            <div className="flex justify-between items-center z-40">
              <span className="text-gray-800">Are you sure you want to delete your account? This action cannot be undone.</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    deleteAccount();
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t.id); // Dismiss the confirmation toast
                    toast.success("Account deletion cancelled.", { id: 'delete-cancel-toast' });
                  }}
                  className="bg-gray-300 p-1 rounded"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        ));
      };
    const deleteAccount = async () => {
      try {
        const response = await fetch(`/api/user/${session?.user?.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Account deleted successfully.", { icon: '✅' });
          // Handle logout or redirect logic here
        } else {
          throw new Error("Failed to delete account.");
        }
      } catch (error) {
        toast.error(error.message);
      }
  };

  return (
    <div className="bg-slate-100 p-6 shadow-md rounded-lg mb-4 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">User Settings</h2>

      {/* Username Update */}
      <form onSubmit={handleUsernameSubmit} className="space-y-6 mb-4">
        <div>
          <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`border rounded-md p-2 w-full ${!usernameChangeAllowed ? "bg-gray-200" : "bg-white"}`}
            disabled={!usernameChangeAllowed}
            placeholder="Enter your username"
            required
          />
          <p className="text-gray-500 text-xs mt-1">
            You can change your username once a week.
          </p>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md p-2 w-full flex justify-center items-center"
          disabled={usernameLoading}
        >
          {usernameLoading ? (
            <>
              <span className="loader mr-2" /> {/* Add a loader here */}
              Updating...
            </>
          ) : (
            "Update Username"
          )}
        </button>
      </form>

      {/* Email Update */}
      <form onSubmit={handleEmailSubmit} className="space-y-6 mb-4">
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md p-2 w-full bg-white"
            placeholder="Enter your email"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md p-2 w-full flex justify-center items-center"
          disabled={emailLoading}
        >
          {emailLoading ? (
            <>
              <span className="loader mr-2" /> {/* Add a loader here */}
              Updating...
            </>
          ) : (
            "Update Email"
          )}
        </button>
      </form>

      {/* Password Update */}
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md p-2 w-full bg-white"
            placeholder="Enter your new password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md p-2 w-full flex justify-center items-center"
          disabled={passwordLoading}
        >
          {passwordLoading ? (
            <>
              <span className="loader mr-2" /> {/* Add a loader here */}
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>

      <button
        onClick={handleDeleteAccount}
        className="text-red-600 mt-4 w-full text-center hover:underline"
      >
        Delete Account
      </button>
    <Toaster />
    </div>
  );
}
