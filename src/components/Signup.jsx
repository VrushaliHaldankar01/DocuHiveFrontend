import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    userType: '1', // Default value for userType
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [emailError, setemailError] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(<EyeOff size={22} />);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleToggle = () => {
    setType(type === 'password' ? 'text' : 'password');
    setIcon(type === 'password' ? <Eye size={22} /> : <EyeOff size={22} />);
  };
  const validate = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/signup',
        formData
      );
      toast.success(response.data.message, { position: 'top-right' });
      setFormData({
        userType: '1',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setemailError(error.response.data.error);
        toast.error(error.response.data.error, { position: 'top-right' });
      } else {
        toast.error('Something went wrong. Please try again!', {
          position: 'top-right',
        });
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900'>
      <div className='bg-gray-800 p-8 rounded-xl shadow-xl w-96'>
        <h2 className='text-3xl font-bold text-center text-white mb-6'>
          Sign Up
        </h2>
        <form onSubmit={handlesubmit} method='POST'>
          <div className='mb-4'>
            <label
              htmlFor='firstName'
              className='block text-sm font-medium text-gray-300'
            >
              First Name
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handlechange}
              className='mt-2 p-3 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your first name'
            />
            {errors.firstName && (
              <p className='text-red-500 text-sm'>{errors.firstName}</p>
            )}
          </div>

          <div className='mb-4'>
            <label
              htmlFor='lastName'
              className='block text-sm font-medium text-gray-300'
            >
              Last Name
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handlechange}
              className='mt-2 p-3 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your last name'
            />
            {errors.lastName && (
              <p className='text-red-500 text-sm'>{errors.lastName}</p>
            )}
          </div>

          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-300'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handlechange}
              className='mt-2 p-3 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your email'
            />
            {errors.email && (
              <p className='text-red-500 text-sm'>{errors.email}</p>
            )}
          </div>

          <div className='mb-6 relative'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-300'
            >
              Password
            </label>
            <div className='relative'>
              <input
                type={type}
                id='password'
                name='password'
                value={formData.password}
                onChange={handlechange}
                className='mt-0 p-3 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 pr-10'
                placeholder='Enter your password'
              />
              <span
                className='absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-white'
                onClick={handleToggle}
              >
                {icon}
              </span>
            </div>
            {errors.password && (
              <p className='text-red-500 text-sm'>{errors.password}</p>
            )}
          </div>

          <div className='flex justify-center'>
            <button
              type='submit'
              className='w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
            >
              Sign Up
            </button>
          </div>
          {emailError && (
            <p className='text-red-500 text-sm mt-2 text-center'>
              {emailError}
            </p>
          )}

          <div className='mt-4 text-center'>
            <h2 className='text-white'>
              Already have an account?{' '}
              <Link to='/login' className='text-blue-400 hover:underline'>
                Login here
              </Link>
            </h2>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
