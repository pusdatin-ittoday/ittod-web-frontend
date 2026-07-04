import React from 'react';
import CompList from './CompList';
import CompListNeo from './CompListNeo';
import Announcement from '../Announcement';

function Beranda({ variant = "default" }) {
    if (variant === "neobrutal") {
        return (
            <>
                <CompListNeo />
                <div className="hidden" aria-hidden="true">
                    <Announcement />
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start lg:mt-20">
            <CompList />
            <Announcement />
        </div>
    );
}

export default Beranda;