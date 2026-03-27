import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div className='font-[family-name:var(--font-poppins)]'>
        <div className='text-sm my-5 font-semibold'>
        HOME &gt; <span className='text-[#0049DB]'>Support</span>
      </div>
      <div className='text-5xl font-extrabold text-[#3E2723]'>
        Your Support And Help Centre
      </div>
      <div className='m-2 p-2'>How can we help you today? Please describe your issue below, and our team will get back to you shortly.</div>
      <div className='m-2 p-2 rounded-2xl shadow-black shadow-lg'>
        <div className='flex gap-5 items-center m-2 p-2 '>
            <div><Image src={"/I.png"} width={20} height={16} alt='i'></Image></div>
            <div className='text-3xl'>Raise A Ticket</div>
        </div>
        <div className='mt-4 mx-4 pt-4 px-4'>DESCRIBE YOUR PROBLEM</div>
        <textarea className='mx-8 my-2 h-40 w-1/2 box-border border-2 border-gray-300' placeholder='Enter details about your issue here....' name="ticket area" id="123"></textarea>

      </div>
              
    </div>
  )
}

export default page
