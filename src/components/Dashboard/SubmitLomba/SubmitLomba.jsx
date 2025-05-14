import React from 'react'
import Announcement from '../Announcement'
import CompSubmitCard from './CompSubmitCard'

const SubmitLomba = () => {
  return (
    <div className="flex gap-6 justify-center items-start px-6 mt-20">
      <CompSubmitCard />
      <Announcement />
    </div>
  )
}

export default SubmitLomba