import React from 'react'

const Sponsors = () => {

    const sponsors = [
        {
            name: "Sponsor 1",
            logo: "/DummyImg.jpg",
        },
        {
            name: "Sponsor 2",
            logo: "/DummyImg.jpg",
        },
        {
            name: "Sponsor 3",
            logo: "/DummyImg.jpg",
        },
        {
            name: "Sponsor 4",
            logo: "/DummyImg.jpg",
        },
        {
            name: "Sponsor 5",
            logo: "/DummyImg.jpg",
        },
        {
            name: "Sponsor 6",
            logo: "/DummyImg.jpg",
        },
        {
            name: "Sponsor 5",
            logo: "/DummyImg.jpg",
        },
        {
            name: "Sponsor 6",
            logo: "/DummyImg.jpg",
        },
        {
            name: "Sponsor 5",
            logo: "/DummyImg.jpg",
        },
        {
            name: "Sponsor 6",
            logo: "/DummyImg.jpg",
        },
    ]

    return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center py-16 px-4 lg:px-8 gap-8">
      <h1 className="text-white text-4xl lg:text-5xl font-playfair font-bold leading-[140.625%] [text-shadow:0px_5px_10px_rgba(172,104,113,0.7)]">
        Our Sponsors
      </h1>
      <div>
        <div className="flex flex-wrap justify-center gap-10 max-w-7xl w-76 md:w-96 lg:w-192">
            {sponsors.map((sponsor, index) => (
                <div key={index} className="flex flex-col items-center justify-center gap-2">
                <div className="rounded-full overflow-hidden">
                    <img src={sponsor.logo} className="w-16 lg:w-32 h-16 lg:h-32 object-contain" />
                </div>
                <p className="text-white text-lg font-dm-sans font-semibold">{sponsor.name}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Sponsors