import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ResetPasswordPage() {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle the password reset logic here
      console.log("Password reset to:", values.password);
      // Redirect to login or another page after successful reset
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
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            Reset Password
          </h2>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password*
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your new password"
                {...formik.getFieldProps("password")}
                className={`w-full p-3 border border-gray-300 rounded mt-1 focus:ring-blue-950 focus:border-blue-950 ${
                  formik.touched.password && formik.errors.password ? "border-red-500" : ""
                }`}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              ) : null}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password*
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your new password"
                {...formik.getFieldProps("confirmPassword")}
                className={`w-full p-3 border border-gray-300 rounded mt-1 focus:ring-blue-950 focus:border-blue-950 ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
              ) : null}
            </div>

            {/* Reset Button */}
            <button className="w-full bg-blue-950 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
              Reset Password
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
