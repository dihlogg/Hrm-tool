"use client";

import { useLogin } from "@/hooks/auth/useLogin";
import {
  UserOutlined,
  KeyOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    userName: "",
    password: "",
  });

  const { login, error } = useLogin();

  const handleLogin = async (overrideUserName?: string, overridePassword?: string) => {
    const un = overrideUserName !== undefined ? overrideUserName : userName;
    const pw = overridePassword !== undefined ? overridePassword : password;

    const errors = {
      userName: un.trim() === "" ? "*Required" : "",
      password: pw.trim() === "" ? "*Required" : "",
    };

    setFieldErrors(errors);

    if (errors.userName || errors.password) return;

    await login(un, pw);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      {/* Left Pane - Saved Accounts */}
      <div className="hidden lg:flex flex-col justify-center w-[35%] bg-gray-100 px-12 xl:px-20 border-r border-gray-200">
        <h2 className="text-4xl !font-extrabold text-[#64728C] mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-10 text-sm tracking-wide">Choose a saved account to continue.</p>

        <div className="flex flex-col w-full gap-5">
          {/* Account 1: Admin */}
          <div 
            onClick={() => {
              setUserName("LongEmployee");
              setPassword("171204");
            }}
            className="flex flex-col w-full p-4 space-y-1 text-gray-600 bg-white sm:p-6 rounded-3xl cursor-pointer hover:bg-orange-50 border-2 border-transparent hover:border-orange-300 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="text-sm font-bold text-orange-500 mb-2">Admin Account</div>
            <div className="flex justify-between items-center w-full">
              <div className="flex justify-between w-full pr-4">
                <div className="text-left">
                  <span className="block text-xs tracking-wide text-gray-400 mb-0.5">Username</span>
                  <span className="text-sm font-medium text-gray-700">LongEmployee</span>
                </div>
                <div className="text-left">
                  <span className="block text-xs tracking-wide text-gray-400 mb-0.5">Password</span>
                  <span className="text-sm font-medium text-gray-700">171204</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <RightOutlined className="text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>
          </div>
          
          {/* Account 2: Employee */}
          <div 
            onClick={() => {
              setUserName("DevManager");
              setPassword("171204");
            }}
            className="flex flex-col w-full p-4 space-y-1 text-gray-600 bg-white sm:p-6 rounded-3xl cursor-pointer hover:bg-orange-50 border-2 border-transparent hover:border-orange-300 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="text-sm font-bold text-orange-500 mb-2">Employee Account</div>
            <div className="flex justify-between items-center w-full">
              <div className="flex justify-between w-full pr-4">
                <div className="text-left">
                  <span className="block text-xs tracking-wide text-gray-400 mb-0.5">Username</span>
                  <span className="text-sm font-medium text-gray-700">DevManager</span>
                </div>
                <div className="text-left">
                  <span className="block text-xs tracking-wide text-gray-400 mb-0.5">Password</span>
                  <span className="text-sm font-medium text-gray-700">171204</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <RightOutlined className="text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Pane - Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-[45%] bg-white px-8 sm:px-16 lg:px-24 xl:px-32 relative">
        <h1 className="text-4xl !font-extrabold text-[#64728C] text-center mb-2">
          Login
        </h1>
        <p className="text-gray-400 text-center mb-10 text-sm tracking-wide">Enter your details to sign in to your account.</p>

        {error && (
          <div className="flex items-center w-full gap-2 px-4 py-3 mb-6 text-sm font-medium text-red-600 border border-red-200 bg-red-50 rounded-2xl">
            <span className="text-lg">
              <ExclamationCircleOutlined />
            </span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col w-full gap-5 sm:gap-5">
          {/* Username */}
          <div className="flex flex-col items-start w-full">
            <label className="flex items-center gap-3 mb-1.5 text-sm font-medium text-gray-600 tracking-wide">
              <UserOutlined size={20} />
              Username
            </label>
            <input
              className={`w-full px-4 py-3.5 text-base !text-gray-600 placeholder-gray-400 transition-all duration-300 bg-white border-2 ${
                fieldErrors.userName ? "border-red-500" : "border-gray-200"
              } sm:text-base rounded-2xl focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-400 placeholder:text-sm hover:border-gray-300`}
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {fieldErrors.userName && (
              <p className="!mt-1.5 text-sm text-red-500">
                {fieldErrors.userName}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col items-start w-full">
            <label className="flex items-center gap-3 mb-1.5 text-sm font-medium text-gray-600 tracking-wide">
              <KeyOutlined size={20} />
              Password
            </label>
            <div className="relative w-full">
              <input
                className={`w-full px-4 py-3.5 pr-12 text-base !text-gray-600 placeholder-gray-400 transition-all duration-300 bg-white border-2 ${
                  fieldErrors.password ? "border-red-500" : "border-gray-200"
                } sm:text-base rounded-2xl focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-400 placeholder:text-sm hover:border-gray-300`}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 !text-black hover:text-gray-700 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOutlined className="text-lg" /> : <EyeInvisibleOutlined className="text-lg" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="!mt-1.5 text-sm text-red-500">
                {fieldErrors.password}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4 mb-8">
          <a className="px-2 py-1 text-sm font-medium text-orange-500 transition-all duration-200 rounded-md cursor-pointer hover:underline hover:text-orange-600">
            Forgot your password?
          </a>
        </div>

        <button
          className="w-full px-4 py-4 text-sm tracking-wider font-bold text-white transition-all duration-300 bg-orange-500 cursor-pointer rounded-3xl hover:bg-orange-400 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-orange-300 active:scale-95 active:translate-y-0"
          onClick={() => handleLogin()}
        >
          LOGIN
        </button>

        <p className="text-center text-sm tracking-wide text-gray-500 !mt-8">
          Don't have an account? <a href="#" className="text-orange-500 font-bold hover:underline">Sign up</a>
        </p>
      </div>

      {/* Right Pane - Orange Strip */}
      <div className="hidden lg:flex flex-col justify-center lg:w-[20%] bg-orange-500 h-full relative overflow-hidden">
         {/* Decorative elements from original to keep the vibe */}
         <div className="absolute top-0 right-0 w-64 h-64 translate-x-20 -translate-y-20 bg-white rounded-full opacity-10"></div>
         <div className="absolute bottom-0 right-0 w-48 h-48 translate-x-16 translate-y-16 bg-white rounded-full opacity-15"></div>
         <div className="absolute left-0 w-32 h-32 -translate-x-16 bg-white rounded-full opacity-10 top-1/2"></div>
      </div>
    </div>
  );
}
