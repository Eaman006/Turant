import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const Nav1 = () => {
  return (
    <div className='bg-black/5 flex justify-between py-2 px-4 rounded-full font-[family-name:var(--font-poppins)]'>
      <div className='text-black text-4xl font-bold my-auto w-1/6 text-center'>TURANT</div>
      <ul className='flex gap-10 font-bold text-2xl my-auto text-black'>
        <li className='cursor-pointer'>Home</li>
        <li className='cursor-pointer'>Services</li>
        <li className='cursor-pointer'>About US</li>
      </ul>
      <div className='flex gap-5'>
        <Image src="/abc.png" width={33} height={33} alt='abc' />
        <Link href="/login"><button className='text-white bg-[#007D37] font-bold px-8 py-2 m-1 rounded-full text-2xl shadow-[0px_6px_0px_rgba(0,0,0,0.25)] active:shadow-none active:translate-y-[6px] transition-all cursor-pointer hover:bg-[#029240]'>
  Join
</button>
</Link>
      </div>
                 
    </div>
  )
}

export default Nav1
