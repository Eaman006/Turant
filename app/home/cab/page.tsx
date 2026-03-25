import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div>
      <div className='shadow-gray-300 shadow-md flex rounded-xl p-4 gap-5 border-gray-300 border-2'>
                  <Image src={"/sh.png"} height={20} width={20} alt='s'></Image>
                  <input className='w-full h-5 outline-none' type="text" placeholder='search for fruit or cabs' />
      
      </div>
      <div>
        HOME &gt; CABS & AUTOS 
      </div>
      <div>
        Cabs & Autos in Kothri Kalan
      </div>
      <div>
        Find reliable transportation options near your hostel. Verified drivers with
        <div>transparent routes.</div>
      </div>
    </div>
  )
}

export default page
