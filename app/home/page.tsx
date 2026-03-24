import React from 'react'
import Image from 'next/image'
import Sidebar from '../Components/Sidebar'

const page = () => {
  return (
    <div className=''>
      <div className='m-0'>
        <Sidebar />
        <div className='ml-28 mr-10 pt-10'>
          <div className='shadow-gray-300 shadow-md flex rounded-xl p-4 gap-5 border-gray-300 border-2'>
            <Image src={"/sh.png"} height={20} width={20} alt='s'></Image>
            <input className='w-full h-5' type="text" placeholder='search for fruit or cabs' />
          </div>
        </div>
      </div>

    </div>
  )
}

export default page
