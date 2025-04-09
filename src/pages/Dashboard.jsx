import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalDetailsForm from '../components/PersonalDetailsForm';
import CompanyDetailsForm from '../components/CompanyDetailForm'; // Make sure this import path is correct
import { toast } from 'react-toastify';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePersonalSuccess = () => {
    setSuccessMessage('Personal details submitted successfully!');
    setActiveForm(null);
  };

  const handleCompanySuccess = () => {
    setSuccessMessage('Company details submitted successfully!');
    setActiveForm(null);
  };

  return (
    <div className='min-h-screen flex bg-gray-50'>
      {/* Sidebar */}
      <div className='w-72 bg-white/10 backdrop-blur-lg border-r border-gray-200 p-6 shadow-lg'>
        <h2 className='text-2xl font-bold mb-8 text-gray-800'>DocuHive</h2>
        <ul className='space-y-3'>
          <li>
            <button
              onClick={() => setActiveForm('personal')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                activeForm === 'personal'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-sm`}
            >
              Personal Details
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveForm('company')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                activeForm === 'company'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-sm`}
            >
              Company Details
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-8'>
        {activeForm ? (
          <>
            <div className='flex justify-between items-center mb-8'>
              <h1 className='text-3xl font-bold text-gray-800'>
                {activeForm === 'personal'
                  ? 'Personal Details'
                  : 'Company Details'}
              </h1>
              {successMessage && (
                <div className='px-4 py-2 bg-green-100 text-green-700 rounded-lg'>
                  {successMessage}
                </div>
              )}
            </div>

            {/* Render the selected form */}
            {activeForm === 'personal' ? (
              <PersonalDetailsForm
                userId={userId}
                onSuccess={handlePersonalSuccess}
                onCancel={() => setActiveForm(null)}
              />
            ) : (
              <CompanyDetailsForm
                userId={userId}
                onSuccess={handleCompanySuccess}
                onCancel={() => setActiveForm(null)}
              />
            )}
          </>
        ) : (
          // Dashboard cards
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div
              className='cursor-pointer p-6 rounded-xl shadow-md border bg-white hover:shadow-lg transition'
              onClick={() => setActiveForm('personal')}
            >
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                Personal Details
              </h2>
              <p className='text-sm text-gray-600'>
                Fill out your education, resume, and portfolio.
              </p>
            </div>

            <div
              className='cursor-pointer p-6 rounded-xl shadow-md border bg-white hover:shadow-lg transition'
              onClick={() => setActiveForm('company')}
            >
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                Company Details
              </h2>
              <p className='text-sm text-gray-600'>
                Add your employment history, salary details, and documents.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
