import React from 'react';
import EventRegisCard from './EventRegisCard';
import Announcement from '../Announcement';

function IkutEvent() {
    return (
        <div className="flex gap-6 justify-center items-start px-6 mt-20">
            <EventRegisCard />
            <Announcement />
        </div>
    );
}

export default IkutEvent;