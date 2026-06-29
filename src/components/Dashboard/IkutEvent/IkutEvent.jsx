import React from 'react';
import EventRegisCard from './EventRegisCard';
import Announcement from '../Announcement';

function IkutEvent() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start lg:mt-20">
            <EventRegisCard />
            <Announcement />
        </div>
    );
}

export default IkutEvent;