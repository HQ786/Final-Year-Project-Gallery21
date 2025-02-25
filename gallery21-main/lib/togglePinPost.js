import toast from "react-hot-toast";
export const togglePinPost = async (postId, action, userId) => {
    if (!userId) {
        toast.error('You need to log in to pin or unpin a post', { id: 'login-pin-post' });
        return;
    }

    try {
        const response = await fetch(`/api/user/${userId}/pin-post`, { // Adjust the URL as per your API route structure
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, action }),
        });

        if (response.ok) {
            const data = await response.json();
            toast.success(data.message); // Display success message
        } else {
            const error = await response.json();
            toast.error(error.error); // Display error message
        }
        return response.status;
    } catch (error) {
        console.error('Error toggling pin status:', error);
        toast.error("An error occurred while toggling pin status.");
    }
    
};
