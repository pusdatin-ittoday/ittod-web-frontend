import React from "react";

const Sponsors = () => {
	const sponsors = [
		{
			name: "Sentral Komputer",
			logo: "/sponsors/Logo-Sentral-Komputer.png",
		},
		{
			name: "Sentral Service",
			logo: "/sponsors/Logo-Sentral_Service.png",
		},
		{
			name:"Acer",
			logo: "/sponsors/Logo-Acer.png",
		},
		{
			name: "Nvidia",
			logo: "/sponsors/nvidia.webp",
		},
		{
			name: "Bangunindo",
			logo: "/sponsors/Logo-Bangunindo.png",
		},
		{
			name:"Siloam Hospitals",
			logo: "/sponsors/Logo-Siloam.png",
		},
		{
			name: "Intelligo.id",
			logo: "/sponsors/Logo-Intelligo.png",
		},
	
	];

	return (
		<div className="min-h-screen min-w-screen flex flex-col items-center justify-center py-16 px-4 lg:px-8 gap-8">
			<h1 className="text-white text-4xl lg:text-5xl font-playfair font-bold leading-[140.625%] [text-shadow:0px_5px_10px_rgba(172,104,113,0.7)]">
				Our Sponsors
			</h1>
			<div>
				<div className="flex flex-wrap justify-center gap-10 w-full">
					{sponsors.map((sponsor, index) => (
						<div
							key={index}
							className="flex flex-col items-center justify-center gap-2"
						>
							<div className="rounded-full overflow-hidden">
								<img
									src={sponsor.logo}
									className="w-32 h-32 lg:w-48 lg:h-48 object-contain"
								/>
							</div>
							<p className="text-white text-lg font-dm-sans font-semibold">
								{sponsor.name}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Sponsors;
