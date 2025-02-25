'use client'
const Feedback = () => {
    const handleSubmit = async (event) => {
      event.preventDefault();
        const feedbackData = {
          name: event.target.name.value,
          email: event.target.email.value,
          feedback: event.target.feedback.value,
        };
        try {
          const response = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedbackData),
          });
          if (response.ok) {
            alert("Thank you for your feedback!");
          } else {
            alert("Failed to submit feedback. Please try again.");
          }
        } catch (error) {
          console.error("Error submitting feedback:", error);
          alert("An error occurred. Please try again later.");
        }
      };
      
  
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">We Value Your Feedback</h1>
        <p className="text-gray-600 text-center mb-6">
          Your feedback helps us improve and serve you better. Please let us know your thoughts.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              rows="4"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share your thoughts with us"
              required
            ></textarea>
          </div>
          <div className="w-full flex justify-center">
          <button
            type="submit"
            className="flex justify-center w-3/4 px-4 py-2 bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Feedback
          </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default Feedback;
  