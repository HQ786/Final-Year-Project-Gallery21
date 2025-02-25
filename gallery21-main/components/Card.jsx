// components/Card.js
import Image from 'next/image';

export default function Card({ imageSrc, title, highlighted, selected }) {
  return (
    <div className={`relative w-full p-4 text-center bg-gray-200 hover:bg-gray-300 rounded-lg ${highlighted ? 'border border-green-500' : ''}`}>
      <Image src={imageSrc} alt={title} width={64} height={64} className="mx-auto" />
      <h3 className="text-base font-bold mt-2 text-gray-800">{title}</h3>
      {selected && (
        <div className="absolute top-2 right-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="checkmark" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24" color='blue'>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
