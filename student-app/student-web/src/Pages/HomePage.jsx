import React, { useState } from "react";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";
import Header from "../components/userHeader";
import Footer from "../components/adminFooter";

const timeFilters = [
  "All",
  "Today",
  "Tomorrow",
  "This Week",
  "This Weekend",
  "Next Week",
  "Next Weekend",
  "This Month",
  "Next Month",
  "This Year",
  "Next Year",
];

const categoryFilters = [
  "All",
  "Arts",
  "Business",
  "Concert",
  "Workshops",
  "Coaching and Consulting",
  "Health and Wellbeing",
  "Volunteer",
  "Sports",
];

const events = [
  {
    id: 1,
    title: "A New Way Of Life",
    image: "../utils/Event.png",
    price: "AUD $100.00*",
    date: "15 Apr",
    time: "Fri, 3:45 PM",
    duration: "1h",
    category: "Workshops",
    remaining: null,
  },
  {
    id: 2,
    title: "Earrings Workshop with Bronwyn David",
    image: "../utils/Event.png",
    price: "AUD $75.00*",
    date: "30 Apr",
    time: "Sat, 11:20 PM",
    duration: "2h",
    category: "Arts",
    remaining: 6,
  },
  {
    id: 3,
    title: "Spring Showcase Saturday April 30th 2022 at 7pm",
    image: "../utils/Event.png",
    price: "Free*",
    date: "1 May",
    time: "Sun, 4:30 PM",
    duration: "3h",
    category: "Concert",
    remaining: null,
  },
  {
    id: 4,
    title: "Shutter Life",
    image: "../utils/Event.png",
    price: "AUD $85.00",
    date: "1 May",
    time: "Sun, 5:30 PM",
    duration: "1h",
    category: "Arts",
    remaining: 7,
  },
  {
    id: 5,
    title: "Friday Night Dinner at The Old Station May 27 2022",
    image: "../utils/Event.png",
    price: "AUD $41.50*",
    date: "27 May",
    time: "Fri, 12:00 PM",
    duration: "5h",
    category: "Business",
    remaining: null,
  },
  {
    id: 6,
    title: "Step Up Open Mic Show",
    image: "../utils/Event.png",
    price: "AUD $200.00*",
    date: "30 Jun",
    time: "Thu, 4:30 PM",
    duration: "1h",
    category: "Concert",
    remaining: null,
  },
  {
    id: 7,
    title: "Tutorial on Canvas Painting for Beginners",
    image: "../utils/Event.png",
    price: "AUD $50.00*",
    date: "17 Jul",
    time: "Sun, 5:30 PM",
    duration: "1h",
    category: "Arts",
    remaining: 17,
  },
  {
    id: 8,
    title: "Trainee Program on Leadership' 2022",
    image: "../utils/Event.png",
    price: "AUD $120.00*",
    date: "20 Jul",
    time: "Wed, 11:30 PM",
    duration: "12h",
    category: "Business",
    remaining: 7,
  },
];

function HomePage() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [savedEvents, setSavedEvents] = useState([]);
  const navigate = useNavigate();

  const handleTimeFilterClick = (filter) => {
    setSelectedTimeFilter(filter);
    navigate(`/discoverEvents`);
  };

  const toggleSaveEvent = (eventId) => {
    setSavedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategoryFilter === "All" ||
      event.category === selectedCategoryFilter;
    const matchesTime = selectedTimeFilter === "All";
    return matchesCategory && matchesTime;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Filters */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleTimeFilterClick(filter)}
                className={`px-3 py-1 rounded-md text-sm transition-all transform hover:scale-105 ${
                  selectedTimeFilter === filter
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {categoryFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedCategoryFilter(filter)}
                className={`px-3 py-1 rounded-md text-sm transition-all transform hover:scale-105 ${
                  selectedCategoryFilter === filter
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-600 hover:text-gray-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={savedEvents.includes(event.id)}
              onSave={toggleSaveEvent}
            />
          ))}
        </div>

        {/* Browse All Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md transition-colors">
            Browse All
          </button>
        </div>
      </main>
      {/* Footer */}
      <Footer />
      <div className=" bottom-0 left-0 right-0  text-white "></div>
    </div>
  );
}

export default HomePage;