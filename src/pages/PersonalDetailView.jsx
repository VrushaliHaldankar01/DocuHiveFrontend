import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PersonalDetailsView = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [personalDetails, setPersonalDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user ID on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
      return;
    }

    setUserId(user.id);
  }, [navigate]);

  // Fetch personal details when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchPersonalDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/display-personal-details?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.data.success) {
          setPersonalDetails(response.data.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalDetails();
  }, [userId]);

  // Function to handle file downloads
  const downloadFile = async (filePath, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/${filePath.replace(/\\/g, '/')}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success(`${fileName} downloaded successfully`);
    } catch (error) {
      toast.error(`Failed to download ${fileName}`);
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!personalDetails) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4'>
          <p>No personal details found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4'>
          <h1 className='text-2xl font-bold text-white'>
            Your Personal Details
          </h1>
        </div>

        {/* Details Content */}
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <DetailItem label='Degree' value={personalDetails.degree} />
            <DetailItem
              label='Institution'
              value={personalDetails.institution}
            />
            <DetailItem
              label='Graduation Year'
              value={personalDetails.graduationYear}
            />
            <DetailItem
              label='Portfolio'
              value={
                <a
                  href={personalDetails.portfolioLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  View Portfolio
                </a>
              }
            />
          </div>

          {/* Documents Section */}
          <div className='border-t border-gray-200 pt-6'>
            <h2 className='text-xl font-semibold mb-4'>Your Documents</h2>
            <div className='flex flex-wrap gap-4'>
              <DocumentButton
                onClick={() =>
                  downloadFile(personalDetails.resume, 'resume.pdf')
                }
                icon={
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    ></path>
                  </svg>
                }
                label='Download Resume'
              />
              <DocumentButton
                onClick={() =>
                  downloadFile(personalDetails.coverLetter, 'cover-letter.pdf')
                }
                icon={
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    ></path>
                  </svg>
                }
                label='Download Cover Letter'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable components
const DetailItem = ({ label, value }) => (
  <div>
    <dt className='text-sm font-medium text-gray-500'>{label}</dt>
    <dd className='mt-1 text-sm text-gray-900'>{value}</dd>
  </div>
);

const DocumentButton = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className='flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200'
  >
    {icon}
    {label}
  </button>
);

export default PersonalDetailsView;
