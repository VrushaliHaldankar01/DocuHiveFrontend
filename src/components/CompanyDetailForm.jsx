import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const CompanyDetailsForm = ({ userId, onSuccess, onCancel }) => {
  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    jobTitle: '',
    employmentPeriod: '',
    salary: '',
  });
  const [appointmentLetterFile, setAppointmentLetterFile] = useState(null);
  const [incrementLetterFile, setIncrementLetterFile] = useState(null);
  const [promotionLetterFile, setPromotionLetterFile] = useState(null);
  const [payslipFiles, setPayslipFiles] = useState([]);
  const [recognitionAwardFiles, setRecognitionAwardFiles] = useState([]);
  const [exitDocumentFiles, setExitDocumentFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingFiles, setExistingFiles] = useState({
    appointmentLetter: null,
    incrementLetter: null,
    promotionLetter: null,
    payslips: [],
    recognitionAwards: [],
    exitDocuments: [],
  });
  const [existingId, setExistingId] = useState(null);

  // Helper function to extract file name
  const getFileName = (filePath) => {
    if (!filePath) return '';
    if (typeof filePath === 'string') {
      return filePath.split('/').pop();
    }
    return filePath.name || 'file';
  };

  // Download file function
  const downloadFile = async (filePath, fileName) => {
    try {
      const downloadName = fileName || getFileName(filePath);
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
      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`File downloaded successfully`);
    } catch (error) {
      toast.error(`Failed to download file`);
      console.error('Download error:', error);
    }
  };

  // Fetch existing company details on component mount
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/fetchCompanyDetails?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.data) {
          setExistingId(response.data.id);
          setCompanyDetails({
            companyName: response.data.data.companyName || '',
            jobTitle: response.data.data.jobTitle || '',
            employmentPeriod: response.data.data.employmentPeriod || '',
            salary: response.data.data.salary || '',
          });

          // Set existing files information
          setExistingFiles({
            appointmentLetter: response.data.data.documents.appointmentLetter,
            incrementLetter: response.data.data.documents.incrementLetter,
            promotionLetter: response.data.data.documents.promotionLetter,
            payslips: response.data.data.documents.payslips || [],
            recognitionAwards:
              response.data.data.documents.recognitionAwards || [],
            exitDocuments: response.data.data.documents.exitDocuments || [],
          });
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error('Failed to fetch company details');
          console.error('Error fetching company details:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [userId]);

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    switch (field) {
      case 'appointmentLetter':
        setAppointmentLetterFile(files[0]);
        break;
      case 'incrementLetter':
        setIncrementLetterFile(files[0]);
        break;
      case 'promotionLetter':
        setPromotionLetterFile(files[0]);
        break;
      case 'payslips':
        setPayslipFiles(Array.from(files));
        break;
      case 'recognitionAwards':
        setRecognitionAwardFiles(Array.from(files));
        break;
      case 'exitDocuments':
        setExitDocumentFiles(Array.from(files));
        break;
      default:
        break;
    }
  };

  const handleRemoveExistingFile = (field, index = null) => {
    if (index !== null) {
      // For array fields (payslips, recognitionAwards, exitDocuments)
      setExistingFiles((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    } else {
      // For single file fields
      setExistingFiles((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !companyDetails.companyName ||
        !companyDetails.jobTitle ||
        !companyDetails.employmentPeriod ||
        !companyDetails.salary
      ) {
        throw new Error('All company fields are required');
      }

      if (!appointmentLetterFile && !existingFiles.appointmentLetter) {
        throw new Error('Appointment letter is required');
      }

      if (!/^\d{4}-\d{4}$/.test(companyDetails.employmentPeriod)) {
        throw new Error('Employment period must be in YYYY-YYYY format');
      }

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('companyName', companyDetails.companyName);
      formData.append('jobTitle', companyDetails.jobTitle);
      formData.append('employmentPeriod', companyDetails.employmentPeriod);
      formData.append('salary', companyDetails.salary);

      // Append files if they exist
      if (appointmentLetterFile) {
        formData.append('appointmentLetter', appointmentLetterFile);
      } else if (existingFiles.appointmentLetter) {
        formData.append('keepAppointmentLetter', 'true');
      }

      if (incrementLetterFile) {
        formData.append('incrementLetter', incrementLetterFile);
      } else if (existingFiles.incrementLetter) {
        formData.append('keepIncrementLetter', 'true');
      }

      if (promotionLetterFile) {
        formData.append('promotionLetter', promotionLetterFile);
      } else if (existingFiles.promotionLetter) {
        formData.append('keepPromotionLetter', 'true');
      }

      // Handle array files
      payslipFiles.forEach((file) => formData.append('payslips', file));
      recognitionAwardFiles.forEach((file) =>
        formData.append('recognitionAwards', file)
      );
      exitDocumentFiles.forEach((file) =>
        formData.append('exitDocuments', file)
      );

      // Add flags for existing files to keep
      existingFiles.payslips.forEach((_, index) => {
        formData.append('keepPayslips', index.toString());
      });
      existingFiles.recognitionAwards.forEach((_, index) => {
        formData.append('keepRecognitionAwards', index.toString());
      });
      existingFiles.exitDocuments.forEach((_, index) => {
        formData.append('keepExitDocuments', index.toString());
      });

      let response;
      if (existingId) {
        // Update existing record
        response = await axios.post(
          `http://localhost:3000/api/company-details`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } else {
        // Create new record
        response = await axios.post(
          'http://localhost:3000/api/company-details',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      }

      toast.success(response.data.message);
      onSuccess();
    } catch (error) {
      console.error('Error submitting company details:', error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto border border-gray-100 flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
      </div>
    );
  }

  // File display component for single files
  const FileDisplay = ({ file, onRemove, onDownload, label }) => {
    if (!file) return null;

    return (
      <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2'>
        <div className='flex items-center'>
          <svg
            className='w-5 h-5 text-gray-500 mr-2'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
              clipRule='evenodd'
            />
          </svg>
          <span className='text-sm text-gray-700'>
            {typeof file === 'string' ? file.split('/').pop() : file.name}
          </span>
        </div>
        <div className='flex space-x-2'>
          <button
            type='button'
            onClick={onDownload}
            className='text-green-500 hover:text-green-700 text-sm font-medium'
          >
            Download
          </button>
          <button
            type='button'
            onClick={onRemove}
            className='text-red-500 hover:text-red-700 text-sm font-medium'
          >
            Remove
          </button>
        </div>
      </div>
    );
  };

  // File display component for multiple files
  const MultiFileDisplay = ({ files, onRemove, onDownload, label }) => {
    if (!files || files.length === 0) return null;

    return (
      <>
        {files.map((file, index) => (
          <div
            key={index}
            className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2'
          >
            <div className='flex items-center'>
              <svg
                className='w-5 h-5 text-gray-500 mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-sm text-gray-700'>
                {typeof file === 'string' ? file.split('/').pop() : file.name}
              </span>
            </div>
            <div className='flex space-x-2'>
              <button
                type='button'
                onClick={() => onDownload(file)}
                className='text-green-500 hover:text-green-700 text-sm font-medium'
              >
                Download
              </button>
              <button
                type='button'
                onClick={() => onRemove(index)}
                className='text-red-500 hover:text-red-700 text-sm font-medium'
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </>
    );
  };

  // File upload component
  const FileUpload = ({ onChange, accept, multiple, label, selectedFiles }) => {
    return (
      <div className='flex items-center'>
        <label className='flex flex-col items-center px-4 py-6 bg-white text-green-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition w-full'>
          <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
              clipRule='evenodd'
            />
          </svg>
          <span className='mt-2 text-sm text-center'>
            {selectedFiles && selectedFiles.length > 0
              ? multiple
                ? `${selectedFiles.length} files selected`
                : selectedFiles.name
              : `Upload ${label} (${accept})`}
          </span>
          <input
            type='file'
            className='hidden'
            onChange={onChange}
            accept={accept}
            multiple={multiple}
          />
        </label>
      </div>
    );
  };

  return (
    <div className='bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto border border-gray-100'>
      <form onSubmit={handleSubmit}>
        <div className='space-y-6'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {existingId ? 'Edit Company Details' : 'Add Company Details'}
          </h2>

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
            {/* Appointment Letter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Appointment Letter*
              </label>
              {existingFiles.appointmentLetter && !appointmentLetterFile ? (
                <FileDisplay
                  file={existingFiles.appointmentLetter}
                  onDownload={() =>
                    downloadFile(existingFiles.appointmentLetter)
                  }
                  onRemove={() => handleRemoveExistingFile('appointmentLetter')}
                />
              ) : (
                <FileUpload
                  onChange={(e) => handleFileChange(e, 'appointmentLetter')}
                  accept='.pdf,.doc,.docx'
                  multiple={false}
                  label='Appointment Letter'
                  selectedFiles={appointmentLetterFile}
                />
              )}
            </div>

            {/* Increment Letter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Increment Letter
              </label>
              {existingFiles.incrementLetter && !incrementLetterFile ? (
                <FileDisplay
                  file={existingFiles.incrementLetter}
                  onDownload={() => downloadFile(existingFiles.incrementLetter)}
                  onRemove={() => handleRemoveExistingFile('incrementLetter')}
                />
              ) : (
                <FileUpload
                  onChange={(e) => handleFileChange(e, 'incrementLetter')}
                  accept='.pdf,.doc,.docx'
                  multiple={false}
                  label='Increment Letter'
                  selectedFiles={incrementLetterFile}
                />
              )}
            </div>

            {/* Promotion Letter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Promotion Letter
              </label>
              {existingFiles.promotionLetter && !promotionLetterFile ? (
                <FileDisplay
                  file={existingFiles.promotionLetter}
                  onDownload={() => downloadFile(existingFiles.promotionLetter)}
                  onRemove={() => handleRemoveExistingFile('promotionLetter')}
                />
              ) : (
                <FileUpload
                  onChange={(e) => handleFileChange(e, 'promotionLetter')}
                  accept='.pdf,.doc,.docx'
                  multiple={false}
                  label='Promotion Letter'
                  selectedFiles={promotionLetterFile}
                />
              )}
            </div>

            {/* Payslips */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Payslips
              </label>
              <MultiFileDisplay
                files={existingFiles.payslips}
                onDownload={(file) => downloadFile(file.path)}
                onRemove={(index) =>
                  handleRemoveExistingFile('payslips', index)
                }
              />
              <FileUpload
                onChange={(e) => handleFileChange(e, 'payslips')}
                accept='.pdf,.doc,.docx'
                multiple={true}
                label='Payslips'
                selectedFiles={payslipFiles}
              />
            </div>

            {/* Recognition Awards */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Recognition Awards
              </label>
              <MultiFileDisplay
                files={existingFiles.recognitionAwards}
                onDownload={(file) => downloadFile(file.path)}
                onRemove={(index) =>
                  handleRemoveExistingFile('recognitionAwards', index)
                }
              />
              <FileUpload
                onChange={(e) => handleFileChange(e, 'recognitionAwards')}
                accept='.pdf,.doc,.docx'
                multiple={true}
                label='Recognition Awards'
                selectedFiles={recognitionAwardFiles}
              />
            </div>

            {/* Exit Documents */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Exit Documents
              </label>
              <MultiFileDisplay
                files={existingFiles.exitDocuments}
                onDownload={(file) => downloadFile(file.path)}
                onRemove={(index) =>
                  handleRemoveExistingFile('exitDocuments', index)
                }
              />
              <FileUpload
                onChange={(e) => handleFileChange(e, 'exitDocuments')}
                accept='.pdf,.doc,.docx'
                multiple={true}
                label='Exit Documents'
                selectedFiles={exitDocumentFiles}
              />
            </div>
          </div>

          <div className='flex justify-end space-x-4 pt-4'>
            <button
              type='button'
              onClick={onCancel}
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
                  {existingId ? 'Updating...' : 'Saving...'}
                </>
              ) : existingId ? (
                'Update Details'
              ) : (
                'Save Details'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyDetailsForm;
