import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div className='flex bg-[#FFF3E0]'>
      <div className="h-screen w-1/2 object-fill bg-[url('/tt.png')]"></div>
      <div className="bg-white w-1/2 flex flex-col  justify-center">
        <div className='text-[#3E2723] text-7xl font-semibold font-[family-name:var(--font-poppins)] text-center'>
          Namaste!
        </div>
        <form action="" className=''>

        <div className='text-[#333333] text-lg font-semibold font-[family-name:var(--font-poppins)]'>
          Phone Number
        </div>
        <input type="text" placeholder='Enter your Number' className='w-full h-10 m-3'/>
        <div>
        
        <button className='bg-[#E67E22] text-[#FFFFFF] text-2xl font-semibold font-[family-name:var(--font-poppins) '>
          GET OTP
        </button>
        </div>
        </form>
        <div className='text-lg font-Regular font-[family-name:var(--font-poppins)]'>
          OR
        </div>
        <div className='text-[#333333] text-2xl font-medium font-[family-name:var(--font-poppins)]'>
          Login with Google
        </div>
      </div>
      
      


    </div>
  )
}

export default page
