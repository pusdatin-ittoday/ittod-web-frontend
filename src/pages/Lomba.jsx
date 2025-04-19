import React from 'react'
import EventCard from '../components/EventCard'

const Lomba = () => {
  return (
    <div className='min-h-screen min-w-screen flex flex-col items-center justify-center py-16 px-4 gap-8'>
      <h1 className='text-white text-5xl font-playfair font-bold leading-[140.625%] [text-shadow:0px_5px_10px_rgba(172,104,113,0.7)]'>
        Competition
      </h1>
      
      {/* competitions */}
      <div className='flex flex-wrap justify-center align-middle gap-10'>
        <EventCard
          title= "Hack Today"
          description= "Acara seru banget aduhai ayo join ittod yang tahun ini"
          imageSrc={"/DummyImg.jpg"}
        />
        <EventCard
          title= "Mine Today"
          description= "Acara seru banget aduhai ayo join ittod yang tahun ini"
          imageSrc={"/DummyImg.jpg"}
        />
        <EventCard
          title= "UX Today"
          description= "Acara seru banget aduhai ayo join ittod yang tahun ini"
          imageSrc={"/DummyImg.jpg"}
        />
        <EventCard
          title= "Game Today"
          description= "Acara seru banget aduhai ayo join ittod yang tahun ini"
          imageSrc={"/DummyImg.jpg"}
        />
      </div>
    </div>
  )
}

export default Lomba