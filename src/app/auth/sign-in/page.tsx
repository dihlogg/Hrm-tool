// pages/login.tsx

import Head from 'next/head';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - OrangeHRM</title>
      </Head>

      <div className="flex items-center justify-center min-h-screen px-4 bg-white">
        <div className="flex w-full max-w-5xl overflow-hidden shadow-xl rounded-2xl">
          {/* Left Section */}
          <div className="w-full p-10 bg-white lg:w-1/2">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <img src="/orangehrm-logo.png" alt="Logo" className="h-12" />
            </div>

            <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">Login</h2>

            {/* Fake Credential Box */}
            <div className="p-4 mb-6 text-sm text-gray-700 bg-gray-100 rounded-md">
              <p>Username: <strong>Admin</strong></p>
              <p>Password: <strong>admin123</strong></p>
            </div>

            {/* Username Field */}
            <div className="flex flex-col items-start mb-4">
              <label className="w-full mb-1 text-sm font-medium text-gray-500">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col items-start mb-6">
              <label className="w-full mb-1 text-sm font-medium text-gray-500">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>

            {/* Login Button */}
            <button className="w-full py-2 text-sm font-semibold text-white transition duration-200 bg-orange-500 rounded-full hover:bg-orange-600">
              Login
            </button>

            {/* Forgot password */}
            <div className="mt-4 text-sm text-center text-orange-500 cursor-pointer">
              Forgot your password?
            </div>

            {/* Footer */}
            <div className="mt-6 text-xs text-center text-gray-500">
              OrangeHRM OS 5.7<br />
              &copy; 2005 - 2025 <a href="#" className="underline">OrangeHRM, Inc</a>. All rights reserved.
            </div>
          </div>

          {/* Right Section (Orange Icon) */}
          <div className="relative items-center justify-center hidden bg-orange-500 lg:flex lg:w-1/2">
            <div className="flex flex-col items-center p-6 bg-white rounded-full">
              <img src="/orange-icon.png" alt="Icon" className="w-24 h-24" />
              <span className="mt-2 text-xs font-medium text-gray-600">HR FOR ALL</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
