import React from 'react';
import CompRegisCard from './CompRegisCard';
import Announcement from '../Announcement';

function IkutLomba() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start lg:mt-20">
            <CompRegisCard />
            <Announcement />
        </div>
    );
}

export default IkutLomba;