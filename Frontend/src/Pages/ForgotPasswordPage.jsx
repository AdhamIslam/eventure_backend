import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex">
        {/* Left Section */}
        <div className="hidden lg:flex w-1/3 bg-green-500 text-white flex-col items-center justify-between p-8 relative">
    
        
          {/* Top Left Section */}
          <div className="absolute top-12 left-12 flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold">Eventure</span>
          </div>
        
         {/* Center Content */}
          <div className="text-center space-y-6 mt-8">
          
        </div> 
      
          {/* Bottom Section */}
          <div className="text-center mb-8">
            <h1 className="text-xl lg:text-3xl font-bold leading-snug">
              The Easiest Way to Create Events and Sell More Tickets Online
            </h1>
          </div>
        </div>
     
        {/* Right Section */}
        <div className="w-full lg:w-2/3 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-700 text-center">
              Forgot Password
            </h2>
            <form className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your Email*
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
    
              
    
              {/* Reset Button */}
              <button className="w-full bg-green-500 text-white py-3 rounded font-bold hover:bg-green-600 transition">
                Reset Password
              </button>
            </form>
    
            {/* Sign In */}
            <div className="text-center text-sm text-gray-600">
               <Link className="text-sm text-green-500 hover:underline mt-1 inline-block" to={'/login'}> Back to sign in</Link>
              
            </div>
          </div>
        </div>
      </div>
    );
  }