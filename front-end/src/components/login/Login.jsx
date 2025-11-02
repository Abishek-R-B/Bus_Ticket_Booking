import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users declaratively to avoid update loops
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleModeSwitch = (mode) => {
    if (isLoginMode !== mode) {
      setIsLoginMode(mode);
      setErrors({});
      clearError?.();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLoginMode) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let result;
      if (isLoginMode) {
        result = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
        });
      }

      if (result.success) {
        navigate("/");
      } else {
        setErrors({ submit: result.error?.message || "An error occurred." });
      }
    } catch (err) {
      setErrors({ submit: err.message || "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="w-full bg-white p-8 rounded-2xl shadow-lg">
          {/* Header */}
          <div className="flex justify-center mb-4">
            <h2 className="text-3xl font-semibold text-center">
              {isLoginMode ? "Login" : "Sign Up"}
            </h2>
          </div>

          {/* Tabs */}
          <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
            <button
              className={`w-1/2 text-lg font-medium transition-all z-10 ${
                isLoginMode ? "text-white" : "text-black"
              }`}
              onClick={() => handleModeSwitch(true)}
            >
              Login
            </button>
            <button
              className={`w-1/2 text-lg font-medium transition-all z-10 ${
                !isLoginMode ? "text-white" : "text-black"
              }`}
              onClick={() => handleModeSwitch(false)}
            >
              Signup
            </button>
            <div
              className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-300 transition-all ${
                isLoginMode ? "left-0" : "left-1/2"
              }`}
            ></div>
          </div>

          {/* Errors */}
          {(error || errors.submit) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error?.message || errors.submit}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-b-2 outline-none focus:border-orange-500 placeholder-gray-400 ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-b-2 outline-none focus:border-orange-500 placeholder-gray-400 ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 border-b-2 outline-none focus:border-orange-500 placeholder-gray-400 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full p-3 border-b-2 outline-none focus:border-orange-500 ${
                      !formData.dateOfBirth ? "text-gray-400" : ""
                    } ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>
                <div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-orange-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* Common Fields */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border-b-2 outline-none focus:border-orange-500 placeholder-gray-400 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-3 border-b-2 outline-none focus:border-orange-500 placeholder-gray-400 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {!isLoginMode && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full p-3 border-b-2 outline-none focus:border-orange-500 placeholder-gray-400 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {isLoginMode && (
              <div className="text-right">
                <a href="#" className="text-orange-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-300 text-white rounded-full text-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : isLoginMode ? "Login" : "Signup"}
            </button>

            <p className="text-center text-gray-600">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => handleModeSwitch(!isLoginMode)}
                className="text-orange-600 hover:underline"
              >
                {isLoginMode ? "Signup now" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
