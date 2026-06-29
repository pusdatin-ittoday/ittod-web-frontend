import React from 'react'
import Announcement from '../Announcement'
import CompSubmitCard from './CompSubmitCard'

const SubmitLomba = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-center items-start lg:mt-20">
      <CompSubmitCard />
      <Announcement />
    </div>
  )
}

export default SubmitLomba