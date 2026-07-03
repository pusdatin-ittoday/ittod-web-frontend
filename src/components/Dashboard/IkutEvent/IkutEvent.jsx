import React from 'react';
import EventRegisCard from './EventRegisCard';
import Announcement from '../Announcement';

function IkutEvent({ variant = "default" }) {
    if (variant === "neobrutal") {
        return (
            <>
                <EventRegisCard variant="neobrutal" />
                <div className="hidden" aria-hidden="true">
                    <Announcement />
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start lg:mt-20">
            <EventRegisCard />
            <Announcement />
        </div>
    );
}

export default IkutEvent;
