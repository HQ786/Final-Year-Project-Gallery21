import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa'; // Using react-icons for a chat icon

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {isOpen && (
                <iframe
                    src="https://cdn.botpress.cloud/webchat/v2/shareable.html?botId=4e8830fc-937a-45d4-b837-fd8880365d66"
                    style={{
                        position: 'fixed',
                        bottom: '60px', // Slightly higher to make room for the icon
                        right: '20px',
                        width: '350px',
                        height: '430px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        zIndex: 1000,
                    }}
                    title="Chatbot"
                ></iframe>
            )}

            <button
                onClick={toggleChatbot}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    fontSize: '24px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                    zIndex: 1001, // Higher than the iframe to ensure it's clickable
                }}
            >
                <FaComments />
            </button>
        </>
    );
};

export default Chatbot;
