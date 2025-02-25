'use client';

import { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Post from '@components/Post';
import Loader from '@components/Loader/Loader';
import CreatePost from './create-post/page';
import { fetchUserProfile } from '@lib/fetchUserProfile';
import { fetchUserPosts } from '@lib/fetchUserPosts';
import AddCover from '@components/AddCover';
import { Pencil, X } from 'lucide-react';
import FollowButton from '@components/FollowButton';
import MiniLoader from '@components/MiniLoader';
import Artworks from '@components/Artworks/Artworks';
import { PostContext } from '@context/PostContext';
import { useImage } from '@context/ImageContext';
import Settings from './settings/page';
import AdminDashboard from '@components/AdminDashboard';
const Profile = ({ params }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const {userPosts, setUserPosts, pinnedPosts, setPinnedPosts} = useContext(PostContext);
  const [error, setError] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedTab, setSelectedTab] = useState('posts');
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updatePost, setUpdatePost] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [postsFetched, setPostsFetched] = useState(false);
  const [followerDiv, setFollowerDiv] = useState(0);
  const [divKey, setDivKey] = useState(0);
  const [div2Key, setDiv2key] = useState(0);
  const {pageData} = useImage();

  const { username } = params;
  useEffect(() => {
    const initializeProfile = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Determine if viewing own profile
      const isOwn = session?.user?.username === username;
      setIsOwnProfile(isOwn);
      if (!user || !postsFetched) {

      try {
        // Fetch profile data
          setLoadingUser(true);
          await fetchUserProfile(
            isOwn ? session?.user?.id : username, 
            setUser, 
            setProfileImage, 
            setError
          );
          setLoadingUser(false);
       
          if (error)
            return;
          // Fetch posts
          setLoadingPosts(true);
          await fetchUserPosts(
            session?.user.id,
            setError,
            setUserPosts,
            setLoadingPosts,
            isOwn ? null : username,
            error,
          );
          if(!error) setPostsFetched(true);
      } catch (err) {
        setError(err.message);
        setLoadingUser(false);
        setLoadingPosts(false);
      }
    };
  }
    initializeProfile();
  }, [session, status, username, router]);

  useEffect(()=>{
    if (postsFetched && pinnedPosts.length===0){
        setPinnedPosts(userPosts.filter(post=>post.isPinned===true))
    }
  },[postsFetched, pinnedPosts])
  const rerenderDiv = () => {
    setDivKey((prev) => prev + 1); // Update key to force re-render
  };

  const rerenderDiv2 = () => {
    setDiv2key((prev) => prev + 1); // Update key to force re-render
  };


  useEffect(()=>{
    if(pageData){
      pageData?.update && setUpdatePost( pageData.update );
    }
  })

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profileImagePath', selectedFile);

    try {
      const response = await fetch(`/api/user/${session?.user.id}/photo`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.profileImagePath);
        setSelectedFile(null);
        setPreviewImage(null);
      } else {
        throw new Error('Failed to update profile image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    }
  };

  const triggerFollowerDiv = () =>{
    setDivKey((prev) => prev + 1);
  };
  

  if (status === 'loading' || loadingUser ) return <Loader />;
  
  if (!user && error) return <div className="h-full flex justify-center place-items-center flex-col font-extrabold text-4xl p-4 text-red-700">
    <div>Error Status {error.status}</div>
    <div >{error.error|| (error?.status===500&&'Server Error')}</div>
    </div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-deviantBlack">
  {/* Banner Image */}
  <AddCover isOwnProfile={isOwnProfile} />

  {/* User Profile Image and Edit Icon */}
  <div className="relative flex flex-col items-start mt-[-4rem] px-6"> {/* Adjusted for left alignment and padding */}
    
    <div className="flex items-center space-x-4 ml-8">
      <img
        src={previewImage || profileImage || "/assets/nft5.png"}
        alt="User Profile"
        onClick={() => {
          isOwnProfile && document.getElementById('profileImageInput').click()
        }}
        className="w-24 h-24 rounded-sm cursor-pointer" 
      />
      <div className='mb-6'>
        <p className="font-extrabold text-4xl text-white capitalize">{user?.username}</p>
        <div className='flex text-white gap-x-2 text-sm' key={followerDiv}>
          <p>Followers {user?.followers.length}</p>|
          <p>Following {user?.following.length}</p>
        </div>
      </div>
      {(!isOwnProfile && !error) && <FollowButton onTrigger={triggerFollowerDiv} user={user} username={username} userId={session?.user.id}/>}
      {user?.roles.includes('Artist')&&<button className='bg-purple-600 p-2 text-white' onClick={()=>{router.push('/create-auction')}} >Auction Artwork</button>}
    </div>

    {isOwnProfile && (
      <>
        <button
          onClick={() => document.getElementById('profileImageInput').click()}
          className="mt-[-1rem] transform shadow-xl rounded-full p-1 hover:bg-gray-200 bg-white active:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-blue-500  ml-8"
        >
          <Pencil width={28} className="text-blue-900" />
        </button>
        <input
          type="file"
          id="profileImageInput"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        {selectedFile && (
          <div className="flex mt-4">
            <button
              onClick={handleImageUpload}
              className="text-sm mt-2 px-4 py-2 bg-white border-2 border-blue-800 text-blue-800 rounded-md hover:bg-blue-50 active:bg-blue-100 transition-colors duration-200 font-medium"
            >
              Change Profile Image ✔
            </button>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewImage(null);
              }}
              className="text-sm mt-2 ml-2 px-4 py-2 bg-white border-2 border-red-700 text-red-700 rounded-md hover:bg-blue-50 active:bg-blue-100 transition-colors duration-200 font-medium flex items-center"
            >
              Discard Preview <X width={18} />
            </button>
          </div>
        )}
      </>
    )}
  </div>


    {isOwnProfile && (
        <CreatePost 
          updatePost={updatePost} 
          setUpdatePost={setUpdatePost} 
          posts={userPosts} 
          setPosts={setUserPosts}
          onTrigger={rerenderDiv}
        />
      )}

      {/* Navbar - Only show settings tab for own profile */}
      {!user?.isAdmin && <nav className="dark:bg-deviantBlack dark:text-slate-300 bg-white shadow-md">
        <div className="flex justify-around p-2">
          <button
            className={`${selectedTab === 'posts' ? 'font-bold' : ''}`}
            onClick={() => setSelectedTab('posts')}
          >
            Posts
          </button>
          <button
            className={`${selectedTab === 'artworks' ? 'font-bold' : ''}`}
            onClick={() => setSelectedTab('artworks')}
          >
            Artworks
          </button>
          {isOwnProfile && (
            <button
              className={`${selectedTab === 'settings' ? 'font-bold' : ''}`}
              onClick={() => setSelectedTab('settings')}
            >
              Settings
            </button>
          )}
        </div>
      </nav>}

      {/* Content */}
      <div className="p-4 flex flex-col lg:flex-row gap-4">
  {user.isAdmin ? (
    <AdminDashboard />
  ) : (
    <>
      {selectedTab === 'posts' ? (
        <>
          {/* 60% Section */}
          <div className="flex-1 lg:basis-3/5">
            {!loadingPosts ? (
              <div
                className="flex flex-col gap-4 px-4 py-2 items-center"
                key={divKey}
              >
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <Post
                      key={post._id}
                      isPinnedPost={false}
                      user={session?.user.id}
                      post={post}
                      Posts={userPosts}
                      setPosts={setUserPosts}
                      isOwnProfile={isOwnProfile}
                      onTrigger={rerenderDiv}
                      setUpdatePost={setUpdatePost}
                    />
                  ))
                ) : error ? (
                  <p className="dark:text-slate-300 text-xl font-extrabold text-gray-800">
                    Error Fetching Posts.
                  </p>
                ) : (
                  <p className="dark:text-slate-300 text-2xl font-extrabold text-gray-800">
                    No posts yet.
                  </p>
                )}
              </div>
            ) : (
              <div className="dark:text-slate-300 py-5">
                <MiniLoader text="Loading Posts.." />
              </div>
            )}
          </div>

          {/* 40% Section */}
          <div className="dark:bg-deviantBlack flex-1 lg:basis-2/5 bg-gray-100 flex gap-y-2 flex-col">
            <div className="dark:bg-nft-black-3 rounded-lg shadow p-2">
              <h3 className="dark:text-slate-300 text-lg font-bold mb-2">About Me</h3>
              <p className="dark:text-slate-300 text-sm text-gray-600">
                Use this space for widgets, statistics, or any other relevant content.
              </p>
            </div>
            <div className="dark:bg-nft-black-3 rounded-lg shadow p-4">
              <h3 className="dark:text-slate-300 text-lg font-bold mb-2">Pinned Posts</h3>
              <div className="dark:text-slate-300 text-sm text-gray-600" key={div2Key}>
                {pinnedPosts &&
                  pinnedPosts.map((post) => (
                    <Post
                      key={post._id + "2"}
                      setUpdatePost={setUpdatePost}
                      user={session?.user.id}
                      post={post}
                      Posts={pinnedPosts}
                      setPosts={setPinnedPosts}
                      isOwnProfile={isOwnProfile}
                      onTrigger={rerenderDiv2}
                      isPinnedPost={true}
                    />
                  ))}
              </div>
            </div>
          </div>
        </>
      ) : selectedTab === "artworks" ? (
        <div className="w-full">
          <h2 className="dark:text-slate-300 p-2 text-2xl font-bold mb-4">Artworks</h2>
          <Artworks id={username} />
        </div>
      ) : (
        isOwnProfile && (
          <div>
            <Settings />
          </div>
        )
      )}
    </>
  )}
</div>


    </div>
  );
};

export default Profile;



// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Post from '@components/Post';
// import Loader from '@components/Loader';
// import CreatePost from '../create-post/page';
// import { fetchUserProfile } from '@lib/fetchUserProfile';
// import { fetchUserPosts } from '@lib/fetchUserPosts';

// const Profile = ( {params} ) => {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState(null);
//   const [loadingUser, setLoadingUser] = useState(true);
//   const [loadingPosts, setLoadingPosts] = useState(true);
//   const [selectedTab, setSelectedTab] = useState('posts');
//   const [profileImage, setProfileImage] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [updatePost, setUpdatePost] = useState(null);
//   const [postsFetched, setPostsFetched ] = useState(false);

//   const [viewProfile, setViewProfile] = useState(false);
//   const { username } = params;

//   useEffect(() => {
//     console.log(params);
//     if (status === 'loading') return;
    
//     if (!session) {
//       router.push('/login');
//       return;
//     }
//     const currentUserId = session.user.id;

//     if (session.user.username !== username)
//       setViewProfile ( true );
//     // Combine fetching user and posts logic
//     if (!user || posts.length === 0) {
//       if (!user) {
//         if(viewProfile){
//           fetchUserProfile(username, setUser, setProfileImage, setError)
//           .then(() => setLoadingUser(false));
//         }
//         else{
//           fetchUserProfile(currentUserId, setUser, setProfileImage, setError)
//           .then(() => setLoadingUser(false));
//         }
//       }
  
//       if (!postsFetched) {
//         fetchUserPosts(currentUserId, setError, setPosts, setLoadingPosts);
//         setPostsFetched(true);
//       }
//     }
//   }, [session, status, username]);


//   // Handle image selection
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreviewImage(URL.createObjectURL(file)); // Preview the image before upload
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = async () => {
//     if (!selectedFile) return;
//     const formData = new FormData();
//     formData.append('profileImagePath', selectedFile); // Attach the selected file

//     try {
//       const response = await fetch(`/api/user/${session.user.id}/photo`, {
//         method: 'PATCH',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setProfileImage(data.profileImagePath); // Update profile image after upload
//         setSelectedFile(null); // Clear the selected file
//         setPreviewImage(null); // Clear the preview
//       } else {
//         console.error('Failed to update profile image', response.json);
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }
//   };

//   if (status === 'loading') return <Loader />;
//   if (loadingUser) return <Loader />;
//   if (loadingPosts) return <Loader />;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Banner Image */}
//       <div className="flex relative w-full h-52 overflow-hidden text-3xl font-semibold justify-center items-center">
//       <div className="absolute text-slate-300 z-30">
//         Upload a Banner Here
//       </div>

//         {/* <img
//           src="https://img.lovepik.com/background/20211021/large/lovepik-blue-banner-background-image_500452484.jpg"
//           alt="Banner"
//           className="absolute inset-0 w-full h-full object-cover"
//         /> */}
//         <div className="absolute inset-0 bg-slate-900 opacity-90"></div>
//       </div>

//       {/* User Profile Image and Edit Icon */}
//       <div className="relative flex flex-col items-center -mt-16">
//         <img
//           src={previewImage || profileImage || "/assets/nft5.png"} // Preview image or the actual profile image
//           alt="User Profile"
//           className="rounded-full w-32 h-32 border-4 border-white"
//         />

//         <button
//           onClick={() => document.getElementById('profileImageInput').click()}
//           className="top-24 transform translate-x-2 bg-white rounded-full p-1 hover:bg-gray-200"
//         >
//           <img
//             src="/assets/edit.png"
//             alt="Edit Profile"
//             className="h-6 w-6"
//           />
//         </button>
//         <input
//           type="file"
//           id="profileImageInput"
//           className="hidden"
//           accept="image/*"
//           onChange={handleImageChange}
//         />

//         {selectedFile && (
//           <button onClick={handleImageUpload} className="mt-2 p-2 bg-blue-500 text-white rounded">
//             Change Profile Image
//           </button>
//         )}

//         <p className="text-xl mt-2 text-center">@{user?.username}</p>
//       </div>

//       {/* Navbar */}
//       <nav className="bg-white shadow-md">
//         <div className="flex justify-around p-4">
//           <button
//             className={`text-lg ${selectedTab === 'posts' ? 'font-bold' : ''}`}
//             onClick={() => setSelectedTab('posts')}
//           >
//             Posts
//           </button>
//           <button
//             className={`text-lg ${selectedTab === 'settings' ? 'font-bold' : ''}`}
//             onClick={() => setSelectedTab('settings')}
//           >
//             Settings
//           </button>
//         </div>
//       </nav>

//       {/* User Posts */}
//       <div className="p-4">
//         {selectedTab === 'posts' ? (
//           <div>
//             <CreatePost updatePost={updatePost} setUpdatePost={setUpdatePost} posts={posts} />
//             <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
//             <div className='flex items-center flex-col'>
//             {posts.length > 0 ? (
//               posts.map((post) => (
//                 <Post
//                   key={post._id}
//                   setUpdatePost={setUpdatePost}
//                   userId={user._id}
//                   post={post}
//                   Posts={posts}
//                   setPosts={setPosts}
//                 />
//               ))
//             ) : (
//               <p>No posts made yet.</p>
//             )}
//             </div>
//           </div>
//         ) : (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Settings</h2>
//             {/* To render settings content here */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;
