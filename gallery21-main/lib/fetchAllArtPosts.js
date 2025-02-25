
export const fetchAllArtPosts = async ( userId, setError, setUser, setLoading, postType, page, limit ) => {
    if (setLoading) setLoading(true);
    
    try {
      
      if(userId){
        const response = await fetch(`/api/user/${userId}/posts/${postType}?limit=${limit}&page=${page}`);
        if (!response.ok) {
            const errorMessage = await response.json();
            if (setError) setError(errorMessage.message || 'Failed to fetch data');
            return;
        }
        const data = await response.json();
        setUser(data);

      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (setError) setError('An error occurred while fetching data');
    } finally {
      if (setLoading) setLoading(false);
    }
  };
  