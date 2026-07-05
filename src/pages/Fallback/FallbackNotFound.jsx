import React from 'react';
import NavbarNeo from '../../components/layout/Navbar';
import FooterNeo from '../../components/layout/Footer';
import Button from '../../components/ui/Button';

const FallbackNotFound = ({ title = "PAGE NOT FOUND", message = "Halaman tidak ditemukan." }) => {
  return (
    <>
      <NavbarNeo />
      <main className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
        <div className="text-center px-4">
          <h1 className="font-bebas text-6xl text-black mb-4">{title}</h1>
          <p className="font-inter text-gray-600 mb-8">
            {message}
          </p>
          <Button variant="indigo-solid" href="/">
            ← Kembali ke Home
          </Button>
        </div>
      </main>
      <FooterNeo />
    </>
  );
};

export default FallbackNotFound;