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
      <div className='m-2 p-2 rounded-2xl shadow-black shadow-lg border-t-4 border-t-blue-600 w-1/2'>
        <div className='flex gap-5 items-center m-2 p-2 '>
            <div><Image src={"/I.png"} width={20} height={16} alt='i'></Image></div>
            <div className='text-3xl'>Raise A Ticket</div>
        </div>
        <div className='mt-4 mx-4 pt-4 px-4'>DESCRIBE YOUR PROBLEM</div>
        <textarea className='ml-8 my-2 h-40 w-4/5 box-border border-2 border-gray-300 bg-[#FEF2DF] p-2' placeholder='Enter details about your issue here....' name="ticket area" id="123"></textarea>
        <div className='m-2 p-2 flex justify-between'>
            <div className='m-2 p-2'>Estimated response time: 2-4 hours</div>
            <button className='bg-[#006D37] flex py-4 gap-5 text-white text-xl rounded-2xl px-6 cursor-pointer'><Image src={"/Co.png"} width={19} height={16} alt='mk'></Image> Submit Ticket</button>
        </div>
        

      </div>
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
