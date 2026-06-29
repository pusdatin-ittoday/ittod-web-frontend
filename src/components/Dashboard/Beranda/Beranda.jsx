import React from 'react';
import CompList from './CompList';
import Announcement from '../Announcement';

function Beranda() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start lg:mt-20">
            <CompList />
            <Announcement />
        </div>
    );
}

export default Beranda;