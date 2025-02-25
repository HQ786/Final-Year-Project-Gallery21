// lib/fetcher.js

export const fetcher = (url) => {
    return fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('An error occurred while fetching data.');
        }
        return res.json();
      })
      .catch((error) => {
        console.error('Error:', error);
        throw error; // Rethrow to be caught by SWR
      });
  };
  