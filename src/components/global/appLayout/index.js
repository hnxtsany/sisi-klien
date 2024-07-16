import React from 'react'
import Header from '@/components/global/header'
import Sidebar from '@/components/global/sidebar'
import Footer from '@/components/global/footer'

const AppLayout = ({children}) => {
  return (
    <>
        <Header />
        <div className="flex">
            <div className="sidebar h-[90vh] w-[15%]">
                <Sidebar />
            </div>
            <div className="content bg-[#EAEEF3] flex-1">
                {children}
            </div>
        </div>
        <Footer />
    </>
  )
}

export default AppLayout