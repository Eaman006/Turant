import Image from 'next/image'
import React from 'react'

const Nav1 = () => {
  return (
    <div className='bg-black/5 flex justify-between p-2'>
      <div className='text-black text-4xl font-semibold'>TURANT</div>
      <ul className='flex gap-5 font-bold text-2xl'>
        <li>Home</li>
        <li>About Us</li>
        <li>Service</li>
      </ul>
      <div className='flex gap-5'>
        <Image src="/abc.png" width={33} height={33} alt='abc' />
        <button className='text-white bg-[#007D37] font-bold px-8 py-2 m-1 rounded-full text-2xl shadow-[0px_6px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[6px] transition-all'>
  Join
</button>
      </div>
                 
    </div>
  )
}

export default Nav1
