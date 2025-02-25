import React from 'react'

const MiniLoader = ({text}) => {
  return (
    <div className='flex font-extrabold text-lg text-gray-700 justify-center gap-x-4'>
      {text}
      <div className='loader-container'>
          <div className='loader large-loader'></div>
      </div>
    </div>
    
  )
}

export default MiniLoader
