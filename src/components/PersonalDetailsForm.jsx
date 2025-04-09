import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PersonalDetailsForm = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [personalDetails, setPersonalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    graduationYear: '',
    portfolioLink: '',
  });
  const [files, setFiles] = useState({
    resume: null,
    coverLetter: null,
  });

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
          setFormData({
            degree: response.data.data.degree || '',
            institution: response.data.data.institution || '',
            graduationYear: response.data.data.graduationYear || '',
            portfolioLink: response.data.data.portfolioLink || '',
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalDetails();
  }, [userId]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({
      ...files,
      [name]: selectedFiles[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', userId);
      formDataToSend.append('degree', formData.degree);
      formDataToSend.append('institution', formData.institution);
      formDataToSend.append('graduationYear', formData.graduationYear);
      formDataToSend.append('portfolioLink', formData.portfolioLink);

      // Only append files if they were selected
      if (files.resume) {
        formDataToSend.append('resume', files.resume);
      }
      if (files.coverLetter) {
        formDataToSend.append('coverLetter', files.coverLetter);
      }

      const response = await axios.post(
        'http://localhost:3000/api/personal-details',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Personal details ${response.data.action} successfully`);
        setPersonalDetails(response.data.data);
        setIsEditing(false);
        setFiles({
          resume: null,
          coverLetter: null,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (personalDetails) {
      setFormData({
        degree: personalDetails.degree || '',
        institution: personalDetails.institution || '',
        graduationYear: personalDetails.graduationYear || '',
        portfolioLink: personalDetails.portfolioLink || '',
      });
    }
    setFiles({
      resume: null,
      coverLetter: null,
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-white'>
            {personalDetails ? 'Your Personal Details' : 'Add Personal Details'}
          </h1>
          {personalDetails && !isEditing && (
            <button
              onClick={handleEditClick}
              className='px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200'
            >
              Edit Details
            </button>
          )}
        </div>

        {/* Content */}
        <div className='p-6'>
          {isEditing || !personalDetails ? (
            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                <FormInput
                  label='Degree'
                  name='degree'
                  value={formData.degree}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label='Institution'
                  name='institution'
                  value={formData.institution}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label='Graduation Year'
                  name='graduationYear'
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label='Portfolio Link'
                  name='portfolioLink'
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* File Uploads */}
              <div className='border-t border-gray-200 pt-6 mb-6'>
                <h2 className='text-xl font-semibold mb-4'>Documents</h2>

                {/* Show existing files if they exist */}
                {personalDetails?.resume && (
                  <div className='mb-4'>
                    <p className='text-sm text-gray-600 mb-1'>
                      Current Resume:
                    </p>
                    <p className='text-sm font-medium text-gray-900'>
                      {personalDetails.resume.split('/').pop()}
                      <button
                        type='button'
                        onClick={() =>
                          downloadFile(personalDetails.resume, 'resume.pdf')
                        }
                        className='ml-2 text-blue-600 hover:text-blue-800 text-sm'
                      >
                        (Download)
                      </button>
                    </p>
                  </div>
                )}

                <FileUpload
                  label={
                    personalDetails?.resume
                      ? 'Update Resume (optional)'
                      : 'Resume'
                  }
                  name='resume'
                  onChange={handleFileChange}
                  required={!personalDetails?.resume}
                />

                {personalDetails?.coverLetter && (
                  <div className='mb-4'>
                    <p className='text-sm text-gray-600 mb-1'>
                      Current Cover Letter:
                    </p>
                    <p className='text-sm font-medium text-gray-900'>
                      {personalDetails.coverLetter.split('/').pop()}
                      <button
                        type='button'
                        onClick={() =>
                          downloadFile(
                            personalDetails.coverLetter,
                            'cover-letter.pdf'
                          )
                        }
                        className='ml-2 text-blue-600 hover:text-blue-800 text-sm'
                      >
                        (Download)
                      </button>
                    </p>
                  </div>
                )}

                <FileUpload
                  label={
                    personalDetails?.coverLetter
                      ? 'Update Cover Letter (optional)'
                      : 'Cover Letter'
                  }
                  name='coverLetter'
                  onChange={handleFileChange}
                  required={!personalDetails?.coverLetter}
                />
              </div>

              <div className='flex justify-end gap-4'>
                {isEditing && (
                  <button
                    type='button'
                    onClick={handleCancelClick}
                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200'
                  >
                    Cancel
                  </button>
                )}
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200'
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* View Mode */}
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
                  {personalDetails.resume && (
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
                  )}
                  {personalDetails.coverLetter && (
                    <DocumentButton
                      onClick={() =>
                        downloadFile(
                          personalDetails.coverLetter,
                          'cover-letter.pdf'
                        )
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
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable components (keep these the same as before)
const DetailItem = ({ label, value }) => (
  <div>
    <dt className='text-sm font-medium text-gray-500'>{label}</dt>
    <dd className='mt-1 text-sm text-gray-900'>{value}</dd>
  </div>
);

const FormInput = ({ label, name, value, onChange, required = false }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
      {required && <span className='text-red-500'>*</span>}
    </label>
    <input
      type='text'
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
    />
  </div>
);

const FileUpload = ({ label, name, onChange, required = false }) => (
  <div className='w-full mb-4'>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
      {required && <span className='text-red-500'>*</span>}
    </label>
    <input
      type='file'
      name={name}
      onChange={onChange}
      accept='.pdf,.doc,.docx'
      required={required}
      className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
    />
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

export default PersonalDetailsForm;
