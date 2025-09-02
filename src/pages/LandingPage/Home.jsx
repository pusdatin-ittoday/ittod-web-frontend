import React from "react";
import Navbar from "../../components/Navbar";
import HeroCard from "../../components/HeroCard";
import Footer from "../../components/Footer";
import Event from "./Event";
import Lomba from "./Lomba";
import ContactUs from "../ContactUs";
import TimelineUmum from "../TimelineUmum";
import Sponsors from "../../Sponsors";
import { FaWhatsapp } from "react-icons/fa";


const Home = () => {
	return (
		<>
			<Navbar />
			<div
				className="min-h-screen flex flex-col justify-start items-center pt-20"
				id="hero"
			>
				<HeroCard Logo={"/collab-logo.webp"} />
		
				<div
					className="flex flex-col items-center w-full px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 font-dm-sans"
					id="about"
				>
					<div className="max-w-7xl mx-auto bg-[#4D3159] rounded-3xl text-white shadow-[0_0_60px_#AC6871] py-12 px-6 mt-12 mb-20">
						<p className="font-dm-sans text-base md:text-lg leading-relaxed text-justify text-pink-100 drop-shadow-[0_0_10px_#ffffff77]">
							<strong>IT Today</strong> merupakan megaproker tahunan Himpunan Mahasiswa Ilmu Komputer (HIMALKOM) IPB dan Departemen Ilmu Komputer IPB yang telah berlangsung sejak 2003. Memasuki tahun ke-20, rangkaian acara seperti seminar komunitas, workshop, kompetisi, seminar nasional, dan awarding hadir dengan kemasan menarik.
							Berkolaborasi dengan <strong>Sentral Komputer</strong>, IT Today menjadi wadah penting yang menghubungkan mahasiswa, masyarakat, dan industri untuk mengembangkan pengetahuan serta keterampilan di bidang ilmu komputer dan teknologi.
						</p>
					</div>
				</div>
			</div>
			<div id="event">
				<Event />
			</div>
			<div id="competition">
				<Lomba />
			</div>
			<div id="timeline">
				<TimelineUmum />
			</div>
			<div id="sponsors">
				<Sponsors />
			</div>
			<div id="contact">
				<ContactUs />
			</div>
			<Footer />
		</>
	);
};

export default Home;
