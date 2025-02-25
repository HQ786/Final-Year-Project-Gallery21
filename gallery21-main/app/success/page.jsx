const Success = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full px-4 text-center space-y-6">
      <h1 className="text-4xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="text-lg text-gray-700">
        Thank you for your purchase! We hope you enjoy your new item.
      </p>
      <p className="text-md text-gray-600">
        We'd love to hear your feedback to make your experience even better.
      </p>
      <div className="space-y-3">
        <a
          href="/stripe-marketplace"
          className="mx-2 inline-block px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          Explore More Items
        </a>
        <a
          href="/feedback"
          className="mx-2 inline-block px-6 py-3 border border-blue-500 text-blue-500 rounded-md shadow hover:bg-blue-50"
        >
          Share Your Feedback
        </a>
      </div>
    </div>
  );
};

export default Success;
