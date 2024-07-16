import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <nav>
            <div className=' px-36 mx-auto flex justify-between items-center py-6 bg-gradient-purple'>
                <div className='flex items-center'>
                    <span className='font-bold text-xl ml-2 text-white'>LABAS</span>
                </div>
                <div className='flex items-center gap-4 font-semibold'>
                    <Link href='#form' className='text-white hover:underline'>Form</Link>
                    <Link href='#laporan' className='text-white hover:underline ml-4'>Laporan</Link>
                    <Link href='/auth/login' className='text-white ml-4 border px-3 py-2 hover:bg-white hover:text-primary-purple'>Masuk</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar