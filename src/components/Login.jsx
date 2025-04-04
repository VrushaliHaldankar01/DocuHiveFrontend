import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(<EyeOff size={22} />);
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const handleToggle = () => {
    setType(type === 'password' ? 'text' : 'password');
    setIcon(type === 'password' ? <Eye size={22} /> : <EyeOff size={22} />);
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};

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

  const verifyEmail = async (token) => {
    try {
      await axios.get(
        `http://localhost:3000/api/v1/auth/verifyEmail?token=${token}`
      );
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Verification failed', error);
      toast.error('Email verification failed', { position: 'top-right' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        formData
      );
      console.log('Login successful:', response.data);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed', {
        position: 'top-right',
      });
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900'>
      <div className='bg-gray-800 p-8 rounded-xl shadow-xl w-96'>
        <h2 className='text-3xl font-bold text-center text-white mb-6'>
          Log In
        </h2>
        <form onSubmit={handleSubmit} method='POST'>
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
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
