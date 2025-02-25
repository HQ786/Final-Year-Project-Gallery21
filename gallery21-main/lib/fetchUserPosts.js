
export const fetchUserPosts = async ( userId, setError, setUser, setLoading, username, error ) => {
    if (setLoading) setLoading(true);
    try {
      let response;
      if ( username ){
        response = await fetch(`/api/user/${userId}/view-profile`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( { username } ),
        });
      }
      else {
        response = await fetch(`/api/user/${userId}/posts`);
      }
      if (!response.ok) {
        const errorMessage = await response.json();
        errorMessage.status = 500;
        (!error) && (setError) && setError(errorMessage || 'Failed to fetch data');
        return;
      }
      const data = await response.json();
      setUser(data); // Set the fetched data (e.g., posts)
    } catch (err) {
      console.error('Fetch error:', err);
      if(!error && setError) setError({status:500,message:"Internal Server Error"});
    } finally {
      if (setLoading) setLoading(false);
    }
  };
  