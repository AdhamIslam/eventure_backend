import React, { useState } from 'react';
import Header from '../components/adminHeader';
import Footer from '../components/adminFooter';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [activeSection, setActiveSection] = useState('home');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'Hey I am John Doe',
    phone: '+01027824410',
    address: 'Alexandria',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  const events = [
    {
      id: 1,
      title: 'Step Up Open Mic Show',
      date: 'Thu, Jun 30, 2024 4:30 AM',
      image: '../utils/Event.png'
    },
    {
      id: 2,
      title: 'Annual Tech Conference',
      date: 'Fri, Jul 15, 2024 9:00 AM',
      image: '../utils/Event.png'
    }
  ];

  const orders = [
    { id: 1, eventName: 'Music Festival', date: '2024-07-20', status: 'Confirmed' },
    { id: 2, eventName: 'Comedy Night', date: '2024-08-05', status: 'Pending' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically send the updated info to your backend
    console.log('Updated user info:', userInfo);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the password change request to your backend
    console.log('Password change requested:', password);
    setPassword({ current: '', new: '', confirm: '' });
  };

  React.useEffect(() => {
    const closeMenu = (e) => {
      if (isProfileMenuOpen && !e.target.closest('.relative')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, [isProfileMenuOpen]);

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Welcome, {userInfo.name}!</h2>
            <p>This is your personal dashboard. You can view your saved events, check your orders, and manage your profile from here.</p>
            <div className="border-b border-gray-200 mt-6">
                <nav className="-mb-px flex" aria-label="Tabs">
                  {['Saved Events', 'Organised Events', 'Attending Events'].map((tab, index) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                      className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                        activeTab === tab.toLowerCase().split(' ')[0]
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                      <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                        activeTab === tab.toLowerCase().split(' ')[0]
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {index === 0 ? 1 : index === 1 ? 2 : 1}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
              <div className="mt-6">
                {activeTab === 'saved' && (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {events.map((event) => (
                        <li key={event.id}>
                          <div className="px-4 py-4 flex items-center sm:px-6">
                            <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                              <div className="truncate">
                                <div className="flex text-sm">
                                  <p className="font-medium text-blue-600 truncate">{event.title}</p>
                                </div>
                                <div className="mt-2 flex">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    <p>
                                      <time dateTime={event.date}>{event.date}</time>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                                <div className="flex overflow-hidden">
                                  <img className="inline-block h-12 w-12 rounded-md" src={event.image} alt="" />
                                </div>
                              </div>
                            </div>
                            <div className="ml-5 flex-shrink-0">
                              <button className="font-medium text-blue-600 hover:text-blue-500">
                                Save
                              </button>
                            </div>
                            <div className="ml-5 flex-shrink-0">
                              <button className="font-medium text-gray-600 hover:text-gray-500">
                                View
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'organised' && (
                  <p className="text-center text-gray-500 py-8">No organised events yet</p>
                )}
                {activeTab === 'attending' && (
                  <p className="text-center text-gray-500 py-8">No attending events yet</p>
                )}
              </div>
          </div>
          
        );
      case 'about':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About Me</h2>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" name="name" value={userInfo.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" name="email" value={userInfo.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea id="bio" name="bio" value={userInfo.bio} onChange={handleInputChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" id="phone" name="phone" value={userInfo.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input type="text" id="address" name="address" value={userInfo.address} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Bio:</strong> {userInfo.bio}</p>
                <p><strong>Phone:</strong> {userInfo.phone}</p>
                <p><strong>Address:</strong> {userInfo.address}</p>
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Edit Information</button>
              </div>
            )}
          </div>
        );
      case 'setting':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Settings</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="current" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" id="current" name="current" value={password.current} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="new" className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" id="new" name="new" value={password.new} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" id="confirm" name="confirm" value={password.confirm} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
              </div>
              <div>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Change Password</button>
              </div>
            </form>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">My Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.eventName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      < Header />
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Section */}
          <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-lg space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src="../utils/user.png"
                  alt="Profile picture"
                  className="w-30 h-30 rounded-full"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <h2 className="mt-4 text-xl font-semibold flex items-center gap-2">
                {userInfo.name}
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">✓</span>
              </h2>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
              
              <div className="flex justify-center gap-8 mt-4">
                <div className="text-center">
                  <div className="font-semibold">0</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">2</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 text-center">{userInfo.bio}</p>
            </div>
          </div>

          {/* Events Section */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => setActiveSection('home')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                    activeSection === 'home'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } flex items-center justify-center`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </button>
                <button
                  onClick={() => setActiveSection('about')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                    activeSection === 'about'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } flex items-center justify-center`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About
                </button>
                <button
                  onClick={() => setActiveSection('setting')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                    activeSection === 'setting'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } flex items-center justify-center`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Setting
                </button>
                <button
                  onClick={() => setActiveSection('orders')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                    activeSection === 'orders'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } flex items-center justify-center`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  My Orders
                </button>
              </div>

              {renderContent()}

             

     
            </div>
          </div>
        </div>
          
      </main>
        {/* Footer */}
       <div className='fixed bottom-0 left-0 right-0  text-white '>
        <Footer />
        </div>
    </div>
  );
};

export default UserProfile;

