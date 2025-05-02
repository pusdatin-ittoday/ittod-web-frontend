import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SidebarAdmin = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Di sini kamu bisa tambahkan logika clear token, dll
    localStorage.removeItem('adminToken');
    navigate('/AdminLogin'); // arahkan ke halaman login
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      <aside
        className="w-64 text-white p-4 bg-cover bg-center rounded-lg flex flex-col justify-between"
        style={{ background: "linear-gradient(0deg, #4D3159 0%, #4D3159 100%)" }}
      >
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Pages</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/AdminCompetitionView" className="block text-white p-2 rounded hover:bg-purple-700">
                Competition View
              </Link>
            </li>
            <li>
              <Link to="/AdminVerifyTeamView" className="block text-white p-2 rounded hover:bg-purple-700">
                Verify Team View
              </Link>
            </li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 text-white py-2 rounded text-center"
          style={{
            background: 'var(--For-reset-pw, linear-gradient(90deg, #F97283 0%, #B247B4 50%, #9323C2 100%))',
          }}
        >
      <span className="text-white text-center text-[20px] font-normal uppercase" style={{ fontFamily: 'Rowdies' }}>
    Logout</span>
        </button>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default SidebarAdmin;