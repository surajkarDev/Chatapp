'use client';
import React, { useState, ChangeEvent, FormEvent,useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { callLoginUser } from './redux/features/page';
import { AppDispatch,RootState } from './redux/store/page';
import { useRouter } from 'next/navigation';
import './globals.css';

type Signup = {
  id: number;
  username: string;
  email: string;
  password: string;
  onlineStatus:boolean
};

type Login = {
  email: string;
  password: string;
};

export default function Home() {
  const [showLoginSignup, setShowLoginSignup] = useState<boolean>(false);
  const [signupData, setSignupData] = useState<Omit<Signup, 'id'>>({ username: '', password: '', email: '',onlineStatus:false });
  const [loginData, setLoginData] = useState<Login>({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const loginUser = useDispatch<AppDispatch>();
  const router = useRouter();
  const userStatusRouter = useSelector<RootState>(state => state.user.onlineStatus);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const validateLogin = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!loginData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(loginData.email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!loginData.password) {
      newErrors.password = 'Password is required.';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUserExist = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await res.json();
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return null;
    }
  };
  
  
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validateLogin()) return;

  const existingUser = await checkUserExist(loginData.email);
    if (!existingUser || existingUser.password !== loginData.password) {
      alert('Invalid email or password');
      return;
    }
    try {
      // Correct PATCH URL for json-server
      const response = await fetch(`http://localhost:3001/users/${existingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ onlineStatus: true }), 
      });
      if (response.ok) {
        const userStatus = await response.json();
        localStorage.setItem('user',JSON.stringify(userStatus));
        localStorage.setItem("loginTime", Date.now().toString());
        loginUser(callLoginUser(userStatus));
        alert(`Welcome back, ${existingUser.username}!`);
        // You can redirect or store user session here
        router.push("/chatApp");
      } else {
        alert("Failed to update user status.");
      }
    } catch (error) {
      console.error("Login Status:", error);
      alert("An error occurred while updating user status.");
    }
  };

  const getUserLoginStatus = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const userObj = userStr ? JSON.parse(userStr) : null;
      if (!userObj || !userObj.id) return;

      const response = await fetch(`http://localhost:3001/users/${userObj.id}`);
      if (response.ok) {
        const data = await response.json(); // await here!
        loginUser(callLoginUser(data));
      }
    } catch (error) {
      console.log("Failed to get user details", error);
    }
  };

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password } = signupData;

    if (!username || !email || !password) {
      alert('All fields are required.');
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert('Invalid email format.');
      return;
    }

    const existingUser = await checkUserExist(email);
    if (existingUser) {
      alert('Email already exists!');
      return;
    }

    const userToSave: Signup = { ...signupData, id: Date.now() };

    try {
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToSave),
      });
      if (res.ok) {
        alert(`User created! Welcome, ${signupData.username}!`);
        setSignupData({ username: '', password: '', email: '',onlineStatus:false });
        setShowLoginSignup(false);
      } else {
        alert('Failed to save user.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup.');
    }
  };
  useEffect(() => {
    const checkAndRedirect = async () => {
      await getUserLoginStatus();
    };
    checkAndRedirect();
  }, []);
  useEffect(() => {
    if (userStatusRouter) {
      router.push("/chatApp");
    }
  }, [userStatusRouter]);
  return (
    <div className="loginSignpuPage">
      <div className="maindiv">
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setShowLoginSignup(false)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              !showLoginSignup
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLoginSignup(true)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              showLoginSignup
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
            }`}
          >
            Signup
          </button>
        </div>

        {!showLoginSignup ? (
          <div className="LoginPage w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Login Page</h3>
            
            <form className="space-y-6" onSubmit={handleLoginSubmit} autoComplete="off">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleLoginChange}
                  value={loginData.email}
                  autoComplete="new-email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleLoginChange}
                  value={loginData.password}
                  autoComplete="new-password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                />
                {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
              </div>
              <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-semibold">
                Login
              </button>
            </form>
          </div>
        ) : (
          <div className="LoginPage w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Signup Page</h3>
            <form className="space-y-6" onSubmit={handleSignupSubmit} autoComplete="off">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  onChange={handleChange}
                  value={signupData.username}
                  autoComplete="username"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={signupData.email}
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={signupData.password}
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                />
              </div>
              <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-semibold">
                Signup
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
