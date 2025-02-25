'use client';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';
import Card from '../../../components/Card';
import artKnowledge from '../../../public/art-knowledge.png';
import artCommunity from '../../../public/art-community.png';
import buyArt from '../../../public/buy.png';
import artGallery from '../../../public/art-gallery.png';
import sellArt from '../../../public/sell.png';
import learnArt from '../../../public/learn.png';
import logo from '../../../public/logo.jpg';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Alert from "@components/CustomAlert";

export default function Intent( {params} ) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [disclaimer, setDisclaimer] = useState(false); 
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const {data: session, status} = useSession();

  useEffect(() => {
    const data = params.userId;
    setUserId(data); 
        
  }, []);
    
  useEffect(() => {
    if (selectedCards.length > 0) {
      setDisclaimer(false);
    }
  }, [selectedCards]); 

  const handleCardClick = (title) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(title)
        ? prevSelected.filter((item) => item !== title) // Deselect if already selected
        : [...prevSelected, title] 
    );
  };

  const handleContinue = async() => {
    if (selectedCards.length > 0) {
      const userRoles = []; 

      if (selectedCards.includes('Buy Art')) {
        userRoles.push('Art Enthusiast');
      }
      if (selectedCards.includes('Sell Art') || selectedCards.includes('Showcase your Art')) {
        userRoles.push('Artist');
      }
      
      if (userRoles.length === 0) {
        userRoles.push('Novice User'); 
      }
      const payload = { userId, userRoles };
      console.log('payload',payload);
      try {
            const response = await fetch(`/api/signup/${userId}`, {
              method: "POST",
              body: JSON.stringify(payload),
              headers: {
                "Content-Type": "application/json",
              },
            });
        
            if (response.ok) {
              Alert("Gallery21","Registration successful!");
        
              router.replace("/login");
            } else {
              const errorData = await response.json();
              console.log(errorData);
            }
          } catch (error) {
            console.error("Signup error:", error);
          }
    } 
    else {
      setDisclaimer(true); // Show disclaimer if no cards selected
    }
  };
  const cards = [
    { imageSrc: artKnowledge, title: "Discover Art" },
    { imageSrc: artCommunity, title: "Join the Community" },
    { imageSrc: buyArt, title: "Buy Art" },
    { imageSrc: artGallery, title: "Showcase your Art" },
    { imageSrc: learnArt, title: "Improve my skill" },
    { imageSrc: sellArt, title: "Sell Art", highlighted: true },
  ];

  return (
    <>
    {status!="loading" && <div className="flex flex-col min-h-screen">
      <div className="absolute left-6 top-8">
        <Image src={logo} alt="Logo" width={64} height={64} className="w-12 h-auto" /> 
      </div>
  
      <div className="text-center mt-12 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">What do you want to do at Gallery21?</h2>
      </div>
  
      <div className="flex flex-wrap justify-around text-black w-full gap-4 p-4 mt-4">
        {cards.map((card) => (
          <div key={card.title} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" onClick={() => handleCardClick(card.title)}>
            <Card
              imageSrc={card.imageSrc}
              title={card.title}
              className={`w-full h-full p-4 cursor-pointer transition-transform duration-200 ${
                selectedCards.includes(card.title) ? 'border-2 border-blue-500 transform scale-105' : 'border'
              }`}
              selected={selectedCards.includes(card.title)} 
            />
          </div>
        ))}
      </div>
  
      <div className="flex justify-center mt-8 mb-2">
        <button 
          onClick={handleContinue}
          className="w-32 bg-red-600 text-white text-center text-base py-2 px-6 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        >
          Continue
        </button>      
      </div>
      
      {disclaimer && (
        <p className='text-center text-red-700 mt-2'>Select at least one option</p>
      )}
    </div>} </>
  );
}
