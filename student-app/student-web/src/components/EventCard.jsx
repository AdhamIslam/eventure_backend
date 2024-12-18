import React from 'react';

const EventCard = ({ event, isSaved, onSave }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={event.image}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => onSave(event.id)}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isSaved
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-600'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">{event.price}</span>
          {event.remaining && (
            <span className="text-sm text-gray-500">
              {event.remaining} Remaining
            </span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span>{event.date}</span>
          <span className="mx-2">•</span>
          <span>{event.time}</span>
          <span className="mx-2">•</span>
          <span>{event.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

