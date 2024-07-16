import React from 'react'
import Image from 'next/image'
import Head from 'next/head'

const Header = () => {
  return (
    <header className="flex justify-between px-7 py-4 shadow-md">
      <div>
        <p className='font-bold text-lg'>Report Web</p>
      </div>
    </header>
  )
}

export default Header