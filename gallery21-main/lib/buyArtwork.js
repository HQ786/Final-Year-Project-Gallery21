import getStripe from "/lib/getStripe";

export const buyArtwork = async (userId, item) => {
    
    console.log(item)
    if (userId && item){
        const stripe = await getStripe();
        const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: item, userId: userId }),
        });

        if (response.ok) {
        const { id } = await response.json();
        stripe.redirectToCheckout({ sessionId: id });
        } else {
        alert("Failed to redirect to checkout");
        }
    }
  };