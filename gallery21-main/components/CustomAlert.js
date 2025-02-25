import React from 'react';

const CustomAlert = ({ title, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-2">{message}</p>
      </div>
    </div>
  );
};

export default CustomAlert;
