import { useState } from "react";
import EventCard from "../components/EventCard";
import Header from "../components/userHeader";
import Footer from "../components/adminFooter";

const browseOptions = [
  "Browse All",
  "Popular Events",
  "New Events",
  "Free Events",
];
const categoryOptions = [
  "All",
  "Music",
  "Arts",
  "Sports",
  "Business",
  "Food & Drink",
];
const timeFilters = [
  "All",
  "Today",
  "Tomorrow",
  "This Week",
  "This Weekend",
  "Next Weekend",
  "This Month",
  "Next Month",
  "This Year",
  "Next Year",
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

function DiscoverEvents() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const [browseFilter, setBrowseFilter] = useState("Browse All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    browse: false,
    category: false,
  });

  const toggleDropdown = (type) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">
          Discover Events For All The Things You Love
        </h1>

        {/* Search Filters */}
        <div className="max-w-3xl mx-auto px-4 flex gap-4">
          {/* Browse Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => toggleDropdown("browse")}
              className="w-full px-4 py-2.5 bg-white border rounded-md flex items-center justify-between text-gray-700 hover:border-gray-400 transition-colors"
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {browseFilter}
              </span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen.browse && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {browseOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setBrowseFilter(option);
                      toggleDropdown("browse");
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => toggleDropdown("category")}
              className="w-full px-4 py-2.5 bg-white border rounded-md flex items-center justify-between text-gray-700 hover:border-gray-400 transition-colors"
            >
              <span>{categoryFilter}</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen.category && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {categoryOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setCategoryFilter(option);
                      toggleDropdown("category");
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Find Button */}
          <button className="px-8 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Find
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events</h2>

        {/* Time Filters */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedTimeFilter(filter)}
                className={`px-3 py-1 rounded-md text-sm transition-all transform hover:scale-105 ${
                  selectedTimeFilter === filter
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={false}
              onSave={() => {}}
            />
          ))}
        </div>

        {/* No More Events Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md transition-colors">
            More Event
          </button>
        </div>
      </div>
      {/* Footer */}
      <Footer />
      <div className=" bottom-0 left-0 right-0  text-white "></div>
    </div>
  );
}

export default DiscoverEvents;
