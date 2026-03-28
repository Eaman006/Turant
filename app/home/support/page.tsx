import React from 'react'
import Image from 'next/image'
import SupportTicketForm from './components/SupportTicketForm'

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
      <SupportTicketForm />
      <div className='bg-[#FEF2DF] flex mt-10 p-2 rounded-2xl shadow-gray-400 shadow-lg gap-5 justify-between'>
        <div className='flex gap-5 items-center'>
          <div className='bg-[#EDE1CF] m-2 w-8 h-8 text-center rounded-full p-1 text-[#6E524D] text-lg'>1</div>
          <div className=''>How to report a driver?</div>
        </div>
        <Image className='m-6' src={"/arrow.png"} width={12} height={7.4} alt='arrow'></Image>

      </div>

    </div>
  )
}

export default page
