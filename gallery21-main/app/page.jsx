"use client";

import Loader from "@components/Loader/Loader";
import { useEffect, useState, Suspense, useCallback, useContext } from 'react';
import { useSession } from 'next-auth/react';
import Gallery from '@components/DashboardPosts';
import { useRouter } from 'next/navigation';
import { OtpModal } from '@components/OtpModal';
import { fetchAllArtPosts } from '@lib/fetchAllArtPosts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MiniLoader from '@components/MiniLoader';
import { PostContext } from '@context/PostContext';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [loadingPosts, setLoadingPosts] = useState(true);
  const router = useRouter();
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [artPosts, setArtPosts] = useState([]);
  const { setPosts } = useContext(PostContext)
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [postsPerPage] = useState(5);


  const openOtpModal = () => setOtpModalOpen(true);

  const closeOtpModal = () => {
    setOtpModalOpen(false);
  }

  const handleFetchArtPosts = useCallback(async (page = currentPage) => {
    if (userId) {
      setLoadingPosts(true);
      try {
        const response = await fetchAllArtPosts(
          userId,
          setError,
          setArtPosts,
          setLoadingPosts,
          'art',
          page,
          postsPerPage
        );

        // Assuming the API returns total count of posts
        if (response?.totalPosts) {
          setTotalPages(Math.ceil(response.totalPosts / postsPerPage));
        }
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoadingPosts(false);
      }
    }
  }, [userId, currentPage, postsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      handleFetchArtPosts(newPage);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    const currentUserId = session.user.id;

    if (currentUserId && artPosts.length === 0) {
      setUserId(currentUserId);

      if (!session.user.isVerified) {
        openOtpModal();
        return;
      }

      handleFetchArtPosts(1);
    }
  }, [session, status, handleFetchArtPosts, router]);

  useEffect(() => {
    if (artPosts)
      setPosts(artPosts);
  }, [artPosts])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleFetchArtPosts(currentPage);
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [handleFetchArtPosts, currentPage]);

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if end page is maxed out
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-1.5 py-0.5 mx-1 rounded ${currentPage === i
              ? 'bg-blue-800 text-white dark:bg-purple-800'
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-200'
            } border border-gray-300 transition-colors duration-200`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="container p-4">
      <h1 className="text-[#e3002a] text-xl font-bold mb-6 dark:text-gray-200">Popular Posts</h1>

      {error && <p className="text-red-600">{error}</p>}

      {loadingPosts ? (
        <MiniLoader />
      ) : (
        <>
          <Gallery
            Posts={artPosts}
            setPosts={setArtPosts}
            userId={userId}
          />
          <p className='text-[#e3002a] text-xl font-bold mt-4 dark:text-gray-200'>Popular Creators</p>

          <div className="my-2  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6 bg-white  dark:bg-deviantBlack rounded-lg shadow-lg">
            <div className="flex gap-x-2 items-center text-center">
              <img
                src="https://i.pinimg.com/originals/63/dd/c2/63ddc24b5f730d8fe4134708fbcc93df.jpg"
                alt="Creator 1"
                className="w-24 h-24 rounded-full border-2 border-blue-500"
              />
              <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Anise</h3>
            </div>

            <div className="flex gap-x-2 items-center text-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6GiWyv4yUzOhaPY4U_qqmI6BfuzrnLtOQMA&s"
                alt="Creator 2"
                className="w-24 h-24 rounded-full border-2 border-green-500"
              />
              <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">jelly</h3>
            </div>

            <div className="flex gap-x-2 items-center text-center">
              <img
                src="https://i.seadn.io/gae/V2_f7h4iOKf4nthrT_q2b9QaVq1ZBa3KrnJkh8x4EFB5k4nx7iYdOnjaSrXWEvpKm6GeMUB2oE7hwPWOWo18RPtwjiU8rIfra8oBQg?auto=format&dpr=1&w=1000"
                alt="Creator 3"
                className="w-24 h-24 rounded-full border-2 border-red-500"
              />
              <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Robo</h3>
            </div>

            <div className="flex gap-x-2 items-center text-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiUz_kyhFtQzgLF4YFbiasybsgZ-Jv_O5DvA&s"
                alt="Creator 4"
                className="w-24 h-24 rounded-full border-2 border-yellow-500"
              />
              <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Newbie</h3>
            </div>

            <div className="flex gap-x-2 items-center text-center">
              <img
                src="https://i.redd.it/trying-to-come-up-with-a-new-avatar-for-my-various-social-v0-8fs49e6e1lsb1.jpg?width=519&format=pjpg&auto=webp&s=220d8e08781d7078c64e3ffc25382a18a87d5c98"
                alt="Creator 5"
                className="w-24 h-24 rounded-full border-2 border-purple-500"
              />
              <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">MrFox</h3>
            </div>
          </div>


          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-10 mt-8 mb-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 dark:text-white rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:text-gray-900 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div>{renderPaginationButtons()}</div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 rounded border dark:text-white border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:text-gray-900 transition-colors duration-200 "
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {status === 'authenticated' && isOtpModalOpen && (
        <OtpModal
          savedEmail={session?.user.email}
          userId={session?.user.id}
          isOpen={isOtpModalOpen}
          onClose={closeOtpModal}
        />
      )}
    </div>
  );
};

export default function WrappedDashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardPage />
    </Suspense>
  );
}



// const LandingPage = () => {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     // Only redirect when status is resolved
//     if (status === "loading") return;

//     if (status === "unauthenticated") {
//       console.log('User is unauthenticated');
//       router.push('/login'); // Redirect to login if unauthenticated
//     } else if (status === "authenticated") {
//       console.log('User is authenticated');
//       router.push('/'); // Redirect to dashboard if authenticated
//     }
//   }, [status, router]);

//   if (status === "loading") {
//     return <Loader />; // Loading state
//   }

//   return null;
// };
