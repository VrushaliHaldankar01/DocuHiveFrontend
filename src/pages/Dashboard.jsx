import React from 'react';

const Dashboard = () => {
  return (
    <div className='min-h-screen flex'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-800 text-white p-6'>
        <h2 className='text-2xl font-semibold mb-8'>Dashboard</h2>
        <ul>
          <li className='mb-6'>
            <a href='#' className='text-lg hover:text-blue-400'>
              Home
            </a>
          </li>
          <li className='mb-6'>
            <a href='#' className='text-lg hover:text-blue-400'>
              Analytics
            </a>
          </li>
          <li className='mb-6'>
            <a href='#' className='text-lg hover:text-blue-400'>
              Users
            </a>
          </li>
          <li className='mb-6'>
            <a href='#' className='text-lg hover:text-blue-400'>
              Settings
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className='flex-1 bg-gray-100 p-8'>
        <h1 className='text-3xl font-semibold mb-6'>
          Welcome to Your Dashboard
        </h1>

        {/* Grid Layout for Widgets */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Widget 1 */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-semibold mb-2'>Revenue</h3>
            <p className='text-lg text-gray-600'>$5,200</p>
          </div>

          {/* Widget 2 */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-semibold mb-2'>Users</h3>
            <p className='text-lg text-gray-600'>1,200</p>
          </div>

          {/* Widget 3 */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-semibold mb-2'>Orders</h3>
            <p className='text-lg text-gray-600'>350</p>
          </div>

          {/* Widget 4 */}
          <div className='bg-white p-6 rounded-lg shadow-md col-span-2 lg:col-span-1'>
            <h3 className='text-xl font-semibold mb-2'>Recent Activity</h3>
            <ul>
              <li className='text-gray-600'>
                User "John Doe" placed an order.
              </li>
              <li className='text-gray-600'>User "Jane Smith" signed up.</li>
              <li className='text-gray-600'>New comment on your post.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
