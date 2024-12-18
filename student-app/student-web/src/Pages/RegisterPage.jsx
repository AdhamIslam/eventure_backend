import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  username: Yup.string().required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  phoneNumber: Yup.string().required("Required"),
  dob: Yup.date().required("Required").nullable(),
});

export default function RegisterPage() {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneNumber: "",
      dob: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values )=> {
      // Handle registration logic here
      try {
        const response = await axios.post('http://localhost:3005/signUp', values);
        console.log('Response:', response.data);
      } catch (error) {
        console.error("Erorr"+error)
      }
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
            Create an Account
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-blue-950"
                >
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter your first name"
                  className="w-full p-3 border border-blue-950 rounded mt-1 focus:ring-blue-950 focus:border-blue-950"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="text-red-500">{formik.errors.firstName}</div>
                ) : null}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-blue-950"
                >
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter your last name"
                  className="w-full p-3 border border-blue-950 rounded mt-1 focus:ring-blue-950 focus:border-blue-950"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="text-red-500">{formik.errors.lastName}</div>
                ) : null}
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-blue-950"
              >
                Username*
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="w-full p-3 border border-blue-950 rounded mt-1 focus:ring-blue-950 focus:border-blue-950"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-500">{formik.errors.username}</div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-950"
              >
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
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-blue-950"
              >
                Phone Number*
              </label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="Enter your phone number"
                className="w-full p-3 border border-blue-950 rounded mt-1 focus:ring-blue-950 focus:border-blue-950"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-red-500">{formik.errors.phoneNumber}</div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-blue-950"
              >
                Date of Birth*
              </label>
              <input
                type="date"
                id="dob"
                className="w-full p-3 border border-blue-950 rounded mt-1 focus:ring-blue-950 focus:border-blue-950"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dob}
              />
              {formik.touched.dob && formik.errors.dob ? (
                <div className="text-red-500">{formik.errors.dob}</div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-950"
              >
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
            </div>

            <button
              type="submit"
              className="w-full bg-blue-950 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              className="text-sm text-blue-950 hover:underline mt-1 inline-block"
              to={"/login"}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}