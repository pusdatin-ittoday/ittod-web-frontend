import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../api/user';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Token verifikasi tidak ditemukan di URL.');
        return;
      }

      try {
        const result = await verifyEmail(token);
        
        if (result.success) {
          setStatus('success');
          setMessage('Email berhasil diverifikasi! Silahkan login.');
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Verifikasi email gagal.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Terjadi kesalahan sistem saat memverifikasi email.');
        console.error(err);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-11/12 max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Verifikasi Email</h2>
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center my-6">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700">Memverifikasi email Anda...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center my-6">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-gray-700">{message}</p>
            <p className="mt-4 text-gray-500 text-sm">
              Anda akan diarahkan ke halaman login dalam beberapa detik...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center my-6">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <p className="text-gray-700">{message}</p>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md cursor-pointer mt-4 font-medium transition-colors duration-200"
              onClick={() => navigate('/login')}
            >
              Kembali ke halaman login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;