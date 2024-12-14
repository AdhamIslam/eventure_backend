import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
 function loginPage() {

  
  
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const getAllClients=()=>{
    axios.get(`http://localhost:3005/loginValidate/${email}`).then((res)=>{
      if (pass == res.data.pass)
        alert(res.data.first_name);
      else
        alert("Wrong user name or pass");

    });
  };

  

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
              Sign in to Eventure
            </h2>
            <form className="space-y-4" >
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your Email*
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)} 
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
    
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => setPass(e.target.value)}
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    
                  </button>
                </div>
                 <Link  className="text-sm text-green-500 hover:underline mt-1 inline-block" to={'/forgotPassword'}>Forgot Password?</Link>
                  
                
              </div>
    
              {/* Sign In Button */}
              <button className="w-full bg-green-500 text-white py-3 rounded font-bold hover:bg-green-600 transition" onClick={getAllClients} >
                Sign In
              </button>
            </form>
    
            {/* Sign Up */}
            <div className="text-center text-sm text-gray-600">
              New to Eventure? <Link className="text-sm text-green-500 hover:underline mt-1 inline-block" to={'/register'}>Sign up</Link>
              
            </div>
          </div>
        </div>
      </div>
    );
  }
  export default loginPage;