
import React from 'react'
import { useMemo } from 'react';

const Timestamp = ({ date, text }) => {
    let timestampTxt = useMemo(() => {
      const parsedDate = date instanceof Date ? date : new Date(date); 
      if (isNaN(parsedDate.getTime())) return 'Invalid date'; 

      const diffInSeconds = Math.floor((Date.now() - parsedDate.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';

      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

      if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
      } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
      } else {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
      }
    }, [date]);
    timestampTxt = text ? text + ' ' + timestampTxt : timestampTxt;
    return <div className='text-gray-500 text-xs max-w-2xl'>{timestampTxt}</div>;
  };

export default Timestamp
