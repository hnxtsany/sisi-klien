import AppLayout from '@/components/global/appLayout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import withAuth from '@/components/global/withAuth'
import { collection, getDocs } from '@firebase/firestore'
import db from '@/config/firestore'


const Akun = () => {
  const [akun, setAkun] = useState([]);
  const [filterAkun, setFilterAkun] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAkun = async () => {
    setLoading(true);
    const akunRef = collection(db, 'users');
    const snapshot = await getDocs(akunRef);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setAkun(data);
    setFilterAkun(data);
    setLoading(false);
  }

  const search = (e) => {
    const keyword = e.target.value;
    const filtered = akun.filter(item => {
      return item.fullname.toLowerCase().includes(keyword.toLowerCase());
    }
    );
    setFilterAkun(filtered);
  }

  useEffect(() => {
    getAkun();
  }
  , []);




  return (
    <>
     <Head>
        <title>Kelola Akun</title>
      </Head> 
      <AppLayout>
      <div className='p-10'>
            <p className='font-bold text-3xl mb-5'>Kelola Akun</p>
            <div className='flex justify-between mb-2'>
              <Link href='/admin/akun/tambah' className='bg-primary-purple px-3 py-3 text-sm rounded-md'>
                <p className='text-white font-semibold'>Tambah Akun</p>
              </Link>
              <div class="w-[15rem]">
                  <label for="table-search" class="sr-only">Search</label>
                  <input type='text' id='title' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm bg-gray-50' name='search' placeholder='Cari Data' onChange={search}/>
              </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right ">
                <thead className="text-xs bg-white uppercase ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Full Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                {
                  filterAkun.length > 0 ? filterAkun.map((item, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.fullname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.role}
                      </td>
                    </tr>
                  )) : (
                    <tr className='bg-white p-2'>
                      <td colSpan='4' className='text-center'>Tidak ada data</td>
                    </tr>
                  )
                }
                </tbody>
              </table>
            </div>
          </div>
      </AppLayout>
    </>
  )
}

export default withAuth(Akun, "admin")