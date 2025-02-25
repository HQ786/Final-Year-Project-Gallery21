const toggleFollow = async (check, username, userId, setIsFollowing, setIsLoading) => {
  try {
      // Construct the API URL and body
      const res = await fetch(`/api/user/${userId}/follow?check=${check}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ targetUsername: username }),
      });

      // Check if the response status is OK (200)
      if (!res.ok) {
        console.log(res)
          throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // If the API returns JSON data, update the UI
      if (data.isFollowing !== undefined) {
          setIsFollowing(data.isFollowing); // Update the following state
          setIsLoading(false); // Stop the loading state
          return data.followers;
      } else {
          console.error('Unexpected response structure:', data);
      }
  } catch (error) {
      console.error('Error toggling follow:', error);
      setIsLoading(false); // Stop the loading state in case of error
  }
};


export default toggleFollow;