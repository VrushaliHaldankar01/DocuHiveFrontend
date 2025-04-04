import React, { useState } from 'react';

const Dashboard = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [personalDetails, setPersonalDetails] = useState({
    degree: '',
    institution: '',
    graduationYear: '',
    portfolioLink: '',
  });
  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    jobTitle: '',
    employmentPeriod: '',
    salary: '',
  });

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    // Handle API call to submit personal details
    console.log('Submitting personal details:', personalDetails);
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    // Handle API call to submit company details
    console.log('Submitting company details:', companyDetails);
  };

  return (
    <div className='min-h-screen flex bg-gray-100'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-800 text-white p-6'>
        <h2 className='text-2xl font-semibold mb-8'>DocuHive</h2>
        <ul>
          <li className='mb-4'>
            <button
              onClick={() => setActiveForm('personal')}
              className='w-full text-left px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition'
            >
              Add Personal Details
            </button>
          </li>
          <li className='mb-4'>
            <button
              onClick={() => setActiveForm('company')}
              className='w-full text-left px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition'
            >
              Add Company Details
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-8'>
        <h1 className='text-3xl font-semibold mb-8'>
          Document Management Dashboard
        </h1>

        {activeForm === 'personal' && (
          <div className='bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-4'>Personal Details</h2>
            <form onSubmit={handlePersonalSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-gray-700 mb-2'>Degree</label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded'
                    value={personalDetails.degree}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        degree: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-gray-700 mb-2'>
                    Institution
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded'
                    value={personalDetails.institution}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        institution: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-gray-700 mb-2'>
                    Graduation Year
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded'
                    value={personalDetails.graduationYear}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        graduationYear: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className='block text-gray-700 mb-2'>
                    Portfolio Link
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded'
                    value={personalDetails.portfolioLink}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        portfolioLink: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>Resume</label>
                <input type='file' className='w-full' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>Cover Letter</label>
                <input type='file' className='w-full' />
              </div>
              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  onClick={() => setActiveForm(null)}
                  className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        )}

        {activeForm === 'company' && (
          <div className='bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-4'>Company Details</h2>
            <form onSubmit={handleCompanySubmit}>
              <div className='grid grid-cols-1 gap-4 mb-4'>
                <div>
                  <label className='block text-gray-700 mb-2'>
                    Company Name
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded'
                    value={companyDetails.companyName}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        companyName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-gray-700 mb-2'>
                      Job Title
                    </label>
                    <input
                      type='text'
                      className='w-full px-3 py-2 border rounded'
                      value={companyDetails.jobTitle}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          jobTitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-gray-700 mb-2'>Salary</label>
                    <input
                      type='text'
                      className='w-full px-3 py-2 border rounded'
                      value={companyDetails.salary}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          salary: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-gray-700 mb-2'>
                    Employment Period
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded'
                    value={companyDetails.employmentPeriod}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        employmentPeriod: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>
                  Appointment Letter
                </label>
                <input type='file' className='w-full' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>Payslips</label>
                <input type='file' multiple className='w-full' />
              </div>
              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  onClick={() => setActiveForm(null)}
                  className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        )}

        {!activeForm && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Summary Cards */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-xl font-semibold mb-2'>Personal Documents</h3>
              <p className='text-lg text-gray-600'>
                Resume, Cover Letter, etc.
              </p>
              <button
                onClick={() => setActiveForm('personal')}
                className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Add Details
              </button>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-xl font-semibold mb-2'>Company Documents</h3>
              <p className='text-lg text-gray-600'>
                Appointment letters, Payslips
              </p>
              <button
                onClick={() => setActiveForm('company')}
                className='mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
              >
                Add Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
