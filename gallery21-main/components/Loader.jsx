//import "@styles/Loader.scss";

import { Lexend } from "next/font/google";

const LexendStyle = Lexend({
  subsets: ['latin'],
  preload: true,
});

const Loader = () => {
  return (
    
    (<div className={`font-semibold text-xl flex items-center justify-center h-screen leading-tight text-blue-500 ${LexendStyle.className}`}>
      {/* Loading */}
            <img className="max-w-32" src="/loader2.gif" alt="Loading..." />
    </div>)
  );
};

export default Loader;

// <div className="loader">
    //   <div className="loader-inner"></div>
    // </div>