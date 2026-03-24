import React from 'react'
import Image from 'next/image'

const Sidebar = () => {
  return (
    <div>
        <div className='m-2 p-2'>
            <Image src={"/hl.png"} height={38} width={40} alt='l'></Image>
        </div>
        <div className='m-2 p-2 flex flex-col gap-5'>
            <Image src={"/h.png"} height={35} width={35} alt='h'></Image>
            <Image src={"/ht.png"} height={37} width={37} alt='ht'></Image>
            <Image src={"/hs.png"} height={36} width={36} alt='hs'></Image>
            <Image src={"/c.png"} height={33} width={33} alt='c'></Image>
        </div>
      
    </div>
  )
}

export default Sidebar
