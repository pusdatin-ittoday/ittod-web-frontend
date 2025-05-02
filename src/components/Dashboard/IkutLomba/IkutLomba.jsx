import React from 'react';
import CompRegisCard from './CompRegisCard';
import Announcement from '../Announcement';

function IkutLomba() {
    return (
        <div className="flex gap-6 justify-center items-start px-6 mt-20">
            <CompRegisCard />
            <Announcement />
        </div>
    );
}

export default IkutLomba;