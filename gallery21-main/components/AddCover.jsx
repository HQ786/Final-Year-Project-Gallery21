import React from 'react'
import { Pencil } from 'lucide-react';

const AddCover = ({isOwnProfile}) => {
    return (
        <div className="flex relative w-full h-52 overflow-hidden justify-center items-center border-b border-slate-500 dark:border-slate-400">
        <div className="absolute dark:text-gray-300 text-slate-800 z-10">
          {/* {isOwnProfile && (
            <button className='flex font-poppins gap-x-2 mx-5'>
              Add a cover photo here
              <Pencil width={28} className="text-blue-900 dark:text-blue-700 dark:hover:bg-slate-600 hover:bg-slate-400 rounded" />
            </button>
          )} */}
        </div>
        <div className="absolute inset-0 bg-gray-400 dark:bg-nft-black-1 dark:opacity-95 opacity-90"></div>
      </div>


    )
}


export default AddCover;
