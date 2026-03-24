import React from 'react'
import Image from 'next/image'
import Sidebar from '../Components/Sidebar'

const page = () => {
  return (
    <div>
      <div className='flex'>
        <Sidebar/>
        <div className='flex'>
          <Image src={"/sh.png"} height={20} width={20} alt='s'></Image>
          <input type="text" placeholder='search for fruit or cabs' />
        </div>
      </div>

    </div>
  )
}

export default page
