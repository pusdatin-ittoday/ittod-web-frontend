import React from 'react';
import NavbarNeo from '../../components/layout/Navbar';
import FooterNeo from '../../components/layout/Footer';
import Button from '../../components/ui/Button';

const FallbackNotFound = () => {
  return (
    <>
      <NavbarNeo />
      <main className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
        <div className="text-center px-4">
          <h1 className="font-bebas text-6xl text-black mb-4">PAGE NOT FOUND</h1>
          <p className="font-inter text-gray-600 mb-8">
            Halaman tidak ditemukan.
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