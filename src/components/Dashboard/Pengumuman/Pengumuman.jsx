import React from 'react';
import PengumumanNeo from './PengumumanNeo';
import Announcement from '../Announcement';

function Pengumuman({ variant = "default" }) {
    if (variant === "neobrutal") {
        return <PengumumanNeo />;
    }

    return (
        <div className="flex justify-center items-start lg:mt-20 w-full">
            <Announcement />
        </div>
    );
}

export default Pengumuman;
