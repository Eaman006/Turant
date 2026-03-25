import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
  return (
    <div className='font-[family-name:var(--font-poppins)]'>
      <div className=''>
        <div>
          <div className='shadow-gray-300 shadow-md flex rounded-xl p-4 gap-5 border-gray-300 border-2'>
            <Image src={"/sh.png"} height={20} width={20} alt='s'></Image>
            <input className='w-full h-5 outline-none' type="text" placeholder='search for fruit or cabs' />

          </div>
          <div className='bg-gradient-to-r from-[#E67E22]/50 to-[#F39C12]/50 mt-10 flex justify-between items-center rounded-2xl'>
            <div className='font-extrabold text-4xl sm:text-4xl text-white p-6 mx-10 flex flex-col'>
              <span className='block leading-[1.05]'>No Middlemen.No Commissions.</span>
              <span className='block mt-2 leading-[1.05]'>Just Direct Contacts.</span>
              <div className='font-light text-lg mt-4'>
                Connect directly with local drivers and shopkeepers. Fair prices for everyone.
              </div>
            </div>
            <div className='p-4 pb-0'>
              <Image className='object-fill' src={"/cc.png"} height={255} width={438} alt='cc'></Image>
            </div>
          </div>
          <div className='text-[#3E2723] my-2 py-2 text-3xl font-extrabold '>Who do you want to call?</div>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-stretch'>
            <Link href="/home/cab">
            <div className='bg-[#2962FF] rounded-2xl cursor-pointer'>
              <div className='m-2 p-4 h-40 flex items-center justify-center'>
                <Image
                  src={"/car.png"}
                  height={118}
                  width={150}
                  alt='car'
                  className='w-full h-full object-contain'
                ></Image>
              </div>
              <div className='text-center text-white font-bold text-xl'>Cabs</div>
            </div>
            </Link>
            <Link href="/home/pg">
            <div className='bg-[#8E44AD] rounded-2xl cursor-pointer'>
              <div className='m-2 p-4 h-40 flex items-center justify-center'>
                <Image
                  src={"/ho.png"}
                  height={139}
                  width={176}
                  alt='ho'
                  className='w-full h-full object-contain'
                ></Image>
              </div>
              <div className='text-center text-white font-bold text-xl'>PG & Hotels</div>
            </div>
            </Link>
            <Link href="/home/restaurant"><div className='bg-[#E67E22] rounded-2xl cursor-pointer'>
              <div className='m-2 p-4 h-40 flex items-center justify-center'>
                <Image
                  src={"/ph.png"}
                  width={157}
                  height={132}
                  alt='ph'
                  className='w-full h-full object-contain'
                ></Image>
              </div>
              <div className='text-center text-white font-bold text-xl'>Restaurant</div>
            </div>
            </Link>
            <Link href="/home/grocery">
            <div className='bg-[#2ECC71] rounded-2xl cursor-pointer'>
              <div className='m-2 p-4 h-40 flex items-center justify-center'>
                <Image
                  src={"/gh.png"}
                  width={160}
                  height={132}
                  alt='gh'
                  className='w-full h-full object-contain'
                ></Image>
              </div>
              <div className='text-center text-white font-bold text-xl'>Grocery</div>
            </div>
            </Link>
            <Link href="/home/medical">
            <div className='bg-[#009688] rounded-2xl cursor-pointer'>
              <div className='m-2 p-4 h-40 flex items-center justify-center'>
                <Image
                  src={"/med.png"}
                  width={157}
                  height={134}
                  alt='med'
                  className='w-full h-full object-contain'
                ></Image>
              </div>
              <div className='text-center text-white font-bold text-xl'>Medical</div>
            </div>
            </Link>
          </div>
        </div>

      </div>


    </div>
  )
}

export default page
