'use client'
import { useEffect, useState } from 'react';

const useUserTimeZone = () => {
    const [userTimeZone, setUserTimeZone] = useState('');

    useEffect(() => {
        // Get user's timezone when the component mounts
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimeZone(timeZone);
    }, []);

    return userTimeZone;
};

export default useUserTimeZone;
