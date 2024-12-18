import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPasswordPage() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle the password reset logic here
      console.log("Reset password for:", values.email);
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/3 bg-blue-950 text-white flex-col items-center justify-between p-8 relative">
        {/* Top Left Section */}
        <img src="../utils/logoBG.png" alt="Logo" className="w-50 h-50" />

        {/* Center Content */}
        <div className="text-center space-y-6 mt-8"></div>

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
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Your Email*
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
                className={`w-full p-3 border border-gray-300 rounded mt-1 focus:ring-blue-950 focus:border-blue-950 ${
                  formik.touched.email && formik.errors.email ? "border-red-500" : ""
                }`}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              ) : null}
            </div>

            {/* Reset Button */}
            <button className="w-full bg-blue-950 text-white py-3 rounded font-bold hover:bg-blue-600 transition">
              Send to email
            </button>
          </form>

          {/* Sign In */}
          <div className="text-center text-sm text-gray-600">
            <Link
              className="text-sm text-blue-950 hover:underline mt-1 inline-block"
              to={"/login"}
            >
              {" "}
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
