import { Link } from "react-router-dom";
export default function HomePage() {
  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="h-10" />
        </div>

        {/* Middle Section: Navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link
            className="text-green-500 hover:underline inline-block"
            to={"/home"}
          >
            Home
          </Link>
          <a href="#" className="text-gray-700 hover:text-green-500">
            Explore Events
          </a>
          <a href="#" className="text-gray-700 hover:text-green-500">
            Pricing
          </a>
          <a href="#" className="text-gray-700 hover:text-green-500">
            Blog
          </a>
          <a href="#" className="text-gray-700 hover:text-green-500">
            Help
          </a>
        </nav>

        {/* Right Section: Buttons and User Avatar */}
        <div className="flex items-center space-x-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Create Event
          </button>
          <img
            src="/user-avatar.jpg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-green-100 text-center py-12">
        <h1 className="text-2xl md:text-4xl font-semibold mb-6">
          Discover Events For All The Things You Love
        </h1>
        <div className="flex flex-wrap justify-center gap-4">
          <select className="border p-3 rounded w-full md:w-48">
            <option>Browse All</option>
          </select>
          <select className="border p-3 rounded w-full md:w-48">
            <option>All</option>
          </select>
          <button className="bg-green-500 text-white px-6 py-3 rounded">
            Find
          </button>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-gray-100 py-4 px-6 overflow-x-auto flex space-x-4">
        {["All", "Today", "Tomorrow", "This Week", "This Month"].map(
          (filter) => (
            <button
              key={filter}
              className="px-4 py-2 bg-white text-gray-700 rounded shadow hover:bg-green-100"
            >
              {filter}
            </button>
          )
        )}
      </div>

      {/* Categories */}
      <div className="py-4 px-6 overflow-x-auto flex space-x-4">
        {["All", "Arts", "Business", "Concert", "Workshops", "Sports"].map(
          (category, index) => (
            <button
              key={index}
              className={`px-4 py-2 ${
                index === 0 ? "bg-green-500 text-white" : "bg-white"
              } rounded shadow hover:bg-green-100`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded shadow hover:shadow-lg transition p-4"
          >
            <img
              src="/event-image.jpg"
              alt="Event"
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="font-bold text-lg mt-4">Event Title</h3>
            <p className="text-gray-600">AUD $100.00</p>
            <p className="text-sm text-gray-500">15 Apr - Fri, 3:45 PM</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <button className="bg-green-500 text-white px-6 py-3 rounded ">
            Browse All 
        </button>
      </div>  
      
    </div>
  );
}
