import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Personal details state
  const [personalDetails, setPersonalDetails] = useState({
    degree: '',
    institution: '',
    graduationYear: '',
    portfolioLink: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);

  // Company details state
  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    jobTitle: '',
    employmentPeriod: '', // Format: "YYYY-YYYY"
    salary: '',
  });
  const [appointmentLetterFile, setAppointmentLetterFile] = useState(null);
  const [incrementLetterFile, setIncrementLetterFile] = useState(null);
  const [promotionLetterFile, setPromotionLetterFile] = useState(null);
  const [payslipFiles, setPayslipFiles] = useState([]);
  const [recognitionAwardFiles, setRecognitionAwardFiles] = useState([]);
  const [exitDocumentFiles, setExitDocumentFiles] = useState([]);
  useEffect(() => {
    // Check authentication and get user ID
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
      return;
    }

    setUserId(user.id);
  }, [navigate]);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !personalDetails.degree ||
        !personalDetails.institution ||
        !personalDetails.graduationYear ||
        !personalDetails.portfolioLink
      ) {
        throw new Error('All text fields are required');
      }

      if (!resumeFile && !coverLetterFile) {
        throw new Error(
          'At least one file (resume or cover letter) is required'
        );
      }

      const formData = new FormData();

      // Append user ID and text fields
      formData.append('userId', userId);
      formData.append('degree', personalDetails.degree);
      formData.append('institution', personalDetails.institution);
      formData.append('graduationYear', personalDetails.graduationYear);
      formData.append('portfolioLink', personalDetails.portfolioLink);

      // Append files with correct field names
      if (resumeFile) formData.append('resume', resumeFile);
      if (coverLetterFile) formData.append('coverLetter', coverLetterFile);

      // Debug: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        'http://localhost:3000/api/personal-details',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(''), 3000);
      setActiveForm(null);
    } catch (error) {
      console.error('Error submitting personal details:', error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Similar validation for company details
      if (
        !companyDetails.companyName ||
        !companyDetails.jobTitle ||
        !companyDetails.employmentPeriod ||
        !companyDetails.salary
      ) {
        throw new Error('All company fields are required');
      }

      if (!appointmentLetterFile) {
        throw new Error('Appointment letter is required');
      }
      // Validate employment period format (YYYY-YYYY)
      if (!/^\d{4}-\d{4}$/.test(companyDetails.employmentPeriod)) {
        throw new Error('Employment period must be in YYYY-YYYY format');
      }

      const formData = new FormData();

      // Append user ID and text fields
      formData.append('userId', userId);
      formData.append('companyName', companyDetails.companyName);
      formData.append('jobTitle', companyDetails.jobTitle);
      formData.append('employmentPeriod', companyDetails.employmentPeriod);
      formData.append('salary', companyDetails.salary);

      // Append files
      // Append files with correct field names
      if (appointmentLetterFile)
        formData.append('appointmentLetter', appointmentLetterFile);
      if (incrementLetterFile)
        formData.append('incrementLetter', incrementLetterFile);
      if (promotionLetterFile)
        formData.append('promotionLetter', promotionLetterFile);

      payslipFiles.forEach((file) => formData.append('payslips', file));
      recognitionAwardFiles.forEach((file) =>
        formData.append('recognitionAwards', file)
      );
      exitDocumentFiles.forEach((file) =>
        formData.append('exitDocuments', file)
      );

      const response = await axios.post(
        'http://localhost:3000/api/company-details',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(''), 3000);
      setActiveForm(null);
      setAppointmentLetterFile(null);
      setIncrementLetterFile(null);
      setPromotionLetterFile(null);
      setPayslipFiles([]);
      setRecognitionAwardFiles([]);
      setExitDocumentFiles([]);
    } catch (error) {
      console.error('Error submitting company details:', error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e, field) => {
    const files = e.target.files; // Get all files

    switch (field) {
      case 'resume':
        setResumeFile(files[0]); // Single file
        break;
      case 'coverLetter':
        setCoverLetterFile(files[0]); // Single file
        break;
      case 'appointmentLetter':
        setAppointmentLetterFile(files[0]); // Single file
        break;
      case 'incrementLetter':
        setIncrementLetterFile(files[0]); // Single file
        break;
      case 'promotionLetter':
        setPromotionLetterFile(files[0]); // Single file
        break;
      case 'payslips':
        setPayslipFiles(Array.from(files)); // Multiple files
        break;
      case 'recognitionAwards':
        setRecognitionAwardFiles(Array.from(files)); // Multiple files
        break;
      case 'exitDocuments':
        setExitDocumentFiles(Array.from(files)); // Multiple files
        break;
      default:
        break;
    }
  };
  // ... (keep your existing JSX return structure, but update the file input handlers)

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
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <svg
                className='w-5 h-5 mr-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              Personal Details
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveForm('company')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                activeForm === 'company'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <svg
                className='w-5 h-5 mr-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                />
              </svg>
              Company Details
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>
            {activeForm === 'personal'
              ? 'Personal Details'
              : activeForm === 'company'
              ? 'Company Details'
              : 'Document Dashboard'}
          </h1>
          {successMessage && (
            <div className='px-4 py-2 bg-green-100 text-green-700 rounded-lg'>
              {successMessage}
            </div>
          )}
        </div>

        {activeForm === 'personal' && (
          <div className='bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto border border-gray-100'>
            <form onSubmit={handlePersonalSubmit}>
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Degree*
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                      value={personalDetails.degree}
                      onChange={(e) =>
                        setPersonalDetails({
                          ...personalDetails,
                          degree: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Institution*
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                      value={personalDetails.institution}
                      onChange={(e) =>
                        setPersonalDetails({
                          ...personalDetails,
                          institution: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Graduation Year*
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                      value={personalDetails.graduationYear}
                      onChange={(e) =>
                        setPersonalDetails({
                          ...personalDetails,
                          graduationYear: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Portfolio Link*
                    </label>
                    <input
                      type='url'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                      value={personalDetails.portfolioLink}
                      onChange={(e) =>
                        setPersonalDetails({
                          ...personalDetails,
                          portfolioLink: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Resume*
                    </label>
                    <div className='flex items-center'>
                      <label className='flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition'>
                        <svg
                          className='w-8 h-8'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='mt-2 text-sm'>
                          {resumeFile
                            ? resumeFile.name
                            : 'Upload Resume (PDF/DOC)'}
                        </span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) => handleFileChange(e, 'resume')}
                          accept='.pdf,.doc,.docx'
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Cover Letter*
                    </label>
                    <div className='flex items-center'>
                      <label className='flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition'>
                        <svg
                          className='w-8 h-8'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='mt-2 text-sm'>
                          {coverLetterFile
                            ? coverLetterFile.name
                            : 'Upload Cover Letter (PDF/DOC)'}
                        </span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) => handleFileChange(e, 'coverLetter')}
                          accept='.pdf,.doc,.docx'
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end space-x-4 pt-4'>
                  <button
                    type='button'
                    onClick={() => setActiveForm(null)}
                    className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-70'
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Details'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {activeForm === 'company' && (
          <div className='bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto border border-gray-100'>
            <form onSubmit={handleCompanySubmit}>
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Company Name*
                  </label>
                  <input
                    type='text'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition'
                    value={companyDetails.companyName}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        companyName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Job Title*
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition'
                      value={companyDetails.jobTitle}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          jobTitle: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Salary*
                    </label>
                    <input
                      type='number'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition'
                      value={companyDetails.salary}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          salary: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Employment Period* (YYYY-YYYY)
                  </label>
                  <input
                    type='text'
                    placeholder='e.g., 2020-2023'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition'
                    value={companyDetails.employmentPeriod}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        employmentPeriod: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className='space-y-4'>
                  {/* Required Documents */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Appointment Letter*
                    </label>
                    <div className='flex items-center'>
                      <label className='flex flex-col items-center px-4 py-6 bg-white text-green-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition'>
                        <svg
                          className='w-8 h-8'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='mt-2 text-sm'>
                          {appointmentLetterFile
                            ? appointmentLetterFile.name
                            : 'Upload Letter (PDF/DOC)'}
                        </span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) =>
                            handleFileChange(e, 'appointmentLetter')
                          }
                          accept='.pdf,.doc,.docx'
                          required
                        />
                      </label>
                    </div>
                  </div>

                  {/* Optional Documents */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Increment Letter
                    </label>
                    <div className='flex items-center'>
                      <label className='flex flex-col items-center px-4 py-6 bg-white text-green-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition'>
                        <svg
                          className='w-8 h-8'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='mt-2 text-sm'>
                          {incrementLetterFile
                            ? incrementLetterFile.name
                            : 'Upload Letter (PDF/DOC)'}
                        </span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) =>
                            handleFileChange(e, 'incrementLetter')
                          }
                          accept='.pdf,.doc,.docx'
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Promotion Letter
                    </label>
                    <div className='flex items-center'>
                      <label className='flex flex-col items-center px-4 py-6 bg-white text-green-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition'>
                        <svg
                          className='w-8 h-8'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='mt-2 text-sm'>
                          {promotionLetterFile
                            ? promotionLetterFile.name
                            : 'Upload Letter (PDF/DOC)'}
                        </span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) =>
                            handleFileChange(e, 'promotionLetter')
                          }
                          accept='.pdf,.doc,.docx'
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Payslips
                    </label>
                    <div className='flex items-center'>
                      <label className='flex flex-col items-center px-4 py-6 bg-white text-green-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition'>
                        <svg
                          className='w-8 h-8'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                          <path
                            fillRule='evenodd'
                            d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='mt-2 text-sm'>
                          {payslipFiles.length > 0
                            ? `${payslipFiles.length} files selected`
                            : 'Upload Payslips (PDF/DOC)'}
                        </span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) => handleFileChange(e, 'payslips')}
                          accept='.pdf,.doc,.docx'
                          multiple
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Recognition Awards
                    </label>
                    <div className='flex items-center'>
                      <label className='flex flex-col items-center px-4 py-6 bg-white text-green-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition'>
                        <svg
                          className='w-8 h-8'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='mt-2 text-sm'>
                          {recognitionAwardFiles.length > 0
                            ? `${recognitionAwardFiles.length} files selected`
                            : 'Upload Awards (PDF/DOC)'}
                        </span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) =>
                            handleFileChange(e, 'recognitionAwards')
                          }
                          accept='.pdf,.doc,.docx'
                          multiple
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Exit Documents
                    </label>
                    <div className='flex items-center'>
                      <label className='flex flex-col items-center px-4 py-6 bg-white text-green-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition'>
                        <svg
                          className='w-8 h-8'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className='mt-2 text-sm'>
                          {exitDocumentFiles.length > 0
                            ? `${exitDocumentFiles.length} files selected`
                            : 'Upload Exit Documents (PDF/DOC)'}
                        </span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) => handleFileChange(e, 'exitDocuments')}
                          accept='.pdf,.doc,.docx'
                          multiple
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end space-x-4 pt-4'>
                  <button
                    type='button'
                    onClick={() => setActiveForm(null)}
                    className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center disabled:opacity-70'
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Details'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        {!activeForm && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Personal Documents Card */}
            <div className='bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition'>
              <div className='flex items-center mb-4'>
                <div className='p-3 bg-blue-100 rounded-lg mr-4'>
                  <svg
                    className='w-6 h-6 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    ></path>
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-800'>
                  Personal Documents
                </h3>
              </div>
              <p className='text-gray-600 mb-6'>
                Manage your resume, cover letter, and educational documents
              </p>
              <button
                onClick={() => setActiveForm('personal')}
                className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  ></path>
                </svg>
                Add Personal Details
              </button>
            </div>

            {/* Company Documents Card */}
            <div className='bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition'>
              <div className='flex items-center mb-4'>
                <div className='p-3 bg-green-100 rounded-lg mr-4'>
                  <svg
                    className='w-6 h-6 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                    ></path>
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-800'>
                  Company Documents
                </h3>
              </div>
              <p className='text-gray-600 mb-6'>
                Manage your employment letters, payslips, and other work
                documents
              </p>
              <button
                onClick={() => setActiveForm('company')}
                className='w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  ></path>
                </svg>
                Add Company Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
