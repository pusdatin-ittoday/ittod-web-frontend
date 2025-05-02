import React from 'react';
import CompList from './CompList';
import Announcement from '../Announcement';

function Beranda() {
    return (
        <div className="flex gap-6 justify-center items-start px-6 mt-20">
            <CompList />
            <Announcement />
        </div>
    );
}

export default Beranda;