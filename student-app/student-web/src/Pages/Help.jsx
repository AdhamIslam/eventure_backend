import { useState } from "react";
import Header from "../components/userHeader";
import Footer from "../components/adminFooter";
import { Link } from "react-router-dom";

export default function Help() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen">
      <div>
        {/* Header */}
        <Header />
      </div>
      {/* Middle Section */}
      <div className=" bg-gray-50 px-60 py-20">
        <h1 className="text-2xl md:text-3xl text--clr-Blue font-bold mb-10 md:mb-20">
          Contact Us
        </h1>
        <div className="flex flex-col-reverse lg:flex-row justify-between">
          <div>
            <img
              src="../utils/contact.png"
              alt="Contact"
              className="mb-10 basis-3/5 py-20"
            />
            <h4 className="text-2xl md:text-3xl text--clr-Blue font-bold mb-10 md:mb-20">
              Keep in touch
            </h4>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 basis-2/5 w-full"
          >
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
              for=":r5:-form-item"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-3.5 md:p-4 pe-12 text-sm shadow-sm bg-white border -border--clr-InputBorder/50 placeholder:text-[#808080]/50 focus:-border--clr-OrangeOne focus:outline-none focus:ring-2 focus:ring-ring rounded-full ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-3"
            />
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
              for=":r5:-form-item"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full p-3.5 md:p-4 pe-12 text-sm shadow-sm bg-white border -border--clr-InputBorder/50 placeholder:text-[#808080]/50 focus:-border--clr-OrangeOne focus:outline-none focus:ring-2 focus:ring-ring rounded-full ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-3"
            />
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
              for=":r5:-form-item"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3.5 md:p-4 pe-12 text-sm shadow-sm bg-white border -border--clr-InputBorder/50 placeholder:text-[#808080]/50 focus:-border--clr-OrangeOne focus:outline-none focus:ring-2 focus:ring-ring rounded-full ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-3"
            />
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
              for=":r5:-form-item"
            >
              Message
            </label>
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="flex min-h-[80px] w-full rounded-[22px] border -border--clr-InputBorder/50 placeholder:text-[#808080]/50 focus:-border--clr-OrangeOne bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-32"
              rows="4"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}