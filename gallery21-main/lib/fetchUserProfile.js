// fetchUserProfile.js

export const fetchUserProfile = async (identifier, setUser, setProfileImage, setError) => {
    try {
      
      if (!identifier) {
        throw new Error('User ID is required');
      }
    
      
      const  res = await fetch(`/api/user/${identifier}`);
      
      if (!res.ok) {
        const message = await res.json();
        message.status = 404;
        if (setError) setError(message); // Only call setError if it's provided
        return;
      }
      const data = await res.json();
      setUser(data);
      if (setProfileImage) setProfileImage(data.profileImagePath || '/assets/nft5.png');
    } catch (err) {
      console.error('Fetch error:', err);
      if (setError) setError('Failed to fetch user data'); // Only call setError if it's provided
    }
  };
  