import React from "react";
import NavbarNeo from './components/layout/Navbar';
import FooterNeo from './components/layout/Footer';

const Sponsors = () => {
	const sponsors = [
		{
			name: "Sentral Komputer",
			logo: "/sponsors/Logo-Sentral-Komputer2.png",
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
		<div 
			className="flex flex-col min-h-screen w-full justify-between font-dm-sans text-[#191b1a]"
			style={{
				background: "radial-gradient(circle at top left, #FDF5B0 0%, #E9E9F0 100%)"
			}}
		>
			<NavbarNeo />
			<main className="flex-grow flex flex-col justify-center items-center py-24 px-4 lg:px-8 gap-12">
				<h1 className="font-bebas text-5xl lg:text-7xl text-[#191b1a] uppercase tracking-wider text-center">
					Our Sponsors
				</h1>
				<div className="flex flex-wrap justify-center gap-8 w-full max-w-[1200px]">
					{sponsors.map((sponsor, index) => (
						<div
							key={index}
							className="flex flex-col items-center justify-center gap-4 bg-white border-2 border-black p-6 shadow-[5px_5px_0px_0px_#000000] w-48 h-56 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_#000000]"
						>
							<div className="w-28 h-28 flex items-center justify-center overflow-hidden">
								<img
									src={sponsor.logo}
									alt={`${sponsor.name} logo`}
									className="max-w-full max-h-full object-contain"
								/>
							</div>
							<p className="text-[#191b1a] text-xs font-dm-sans font-black uppercase text-center truncate w-full">
								{sponsor.name}
							</p>
						</div>
					))}
				</div>
			</main>
			<FooterNeo />
		</div>
	);
};

export default Sponsors;
