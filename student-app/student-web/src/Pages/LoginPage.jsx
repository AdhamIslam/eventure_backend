import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
});

function LoginPage() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      
      console.log(email.value);
      axios.get(`http://localhost:3005/loginValidate/${email.value}`).then((res)=>{
        
        if (password.value == res.data.pass)
          navigate("/HomePage",{state:{client_id: res.client_id }});
        else
          alert("Wrong user name or pass");
  
      });
      console.log(values);
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/3 bg-blue-950 text-white flex-col items-center justify-between p-8 relative">
        <img src="../utils/logoBG.png" alt="Logo" className="w-50 h-50" />
        <div className="text-center mb-8">
          <h1 className="text-xl lg:text-3xl font-bold leading-snug">
            The Easiest Way to Create Events and Sell More Tickets Online
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-blue-950 text-center">
            Sign in to Eventure
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-950">
                Your Email*
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-blue-950 rounded mt-1 focus:ring-blue-950 focus:border-blue-950"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-950">
                Password*
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-blue-950 rounded mt-1 focus:ring-blue-950 focus:border-blue-950"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
              <Link className="text-sm text-blue-700 hover:underline mt-1 inline-block" to={"/forgotPassword"}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="w-full bg-blue-950 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
              Sign In
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            New to Eventure?{" "}
            <Link className="text-sm text-blue-950 hover:underline mt-1 inline-block" to={"/register"}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}export default LoginPage;
