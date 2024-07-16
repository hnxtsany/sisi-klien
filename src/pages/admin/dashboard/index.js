import AppLayout from '@/components/global/appLayout'
import CardLaporan from '@/components/global/cardLaporan';
import LoadingLayout from '@/components/global/loadingLayout';
import withAuth from '@/components/global/withAuth';
import db from '@/config/firestore';
import formatDate from '@/utils/formatDate';
import { collection, deleteDoc, doc, getDocs } from '@firebase/firestore';
import { deleteObject, getStorage, ref } from '@firebase/storage';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [laporan, setLaporan] = useState([]);
  const router = useRouter();
  const [filterLaporan, setFilterLaporan] = useState([]);
  const [loading, setLoading] = useState(false);

  const allert = (id, imageUrl) => {
    Swal.fire({
      title: 'Kamu Yakin?',
      text: "Kamu tidak akan bisa mengembalikan data yang sudah dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDocs(id, imageUrl);
        Swal.fire(
          'Berhasil dihapus!',
          'Data kamu berhasil dihapus.',
          'success'
        )}
      })
    }

  const getLaporan = async () => {
    setLoading(true);
    const laporanRef = collection(db, 'laporan');
    const snapshot = await getDocs(laporanRef);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setLaporan(data);
    setFilterLaporan(data);
    setLoading(false);
  }

  const search = (e) => {
    const keyword = e.target.value;
    const filtered = laporan.filter(item => {
      return item.judul_laporan.toLowerCase().includes(keyword.toLowerCase());
    }
    );
    setFilterLaporan(filtered);
  }


  useEffect(() => {
    getLaporan();
  }, []);

  const deleteDocs = async (id, imageUrl) => {
    const storage = getStorage();
    try {
      const httpRef = ref(storage, imageUrl);
      deleteObject(httpRef).then(() => {
        console.log('File deleted successfully');
      }).catch((error) => {
        console.error('Error removing file:', error);
      });
      await deleteDoc(doc(db, 'laporan', id));
      getLaporan();
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <AppLayout>
        {loading ? (
          <LoadingLayout/> 
        )
          : (
          <div className='p-10'>
            <p className='font-bold text-3xl mb-5'>Dashboard</p>
            <div className='flex mb-2'>
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
                      Judul Laporan
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Tanggal Kejadian
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Kabupaten
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Kecamatan
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Kelurahan
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                   filterLaporan.length > 0 ? filterLaporan.map((item, index) => (
                    <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                      <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                        {item.judul_laporan}
                      </th>
                      <td className="px-6 py-4">
                        {formatDate(item.tanggal_kejadian)}
                      </td>
                      <td className="px-6 py-4">
                        {item.kabupaten}
                      </td>
                      <td className="px-6 py-4">
                        {item.kecamatan}
                      </td>
                      <td className="px-6 py-4">
                        {item.kelurahan}
                      </td>
                      <td className="px-6 py-4">
                        {item.status}
                      </td>

                      <td className="flex flex-wrap items-center justify-start px-6 py-4">
                        <Link href={`/admin/laporan/${item.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
                        <p className="font-medium text-red-600 dark:text-red-500 cursor-pointer hover:underline ms-5" onClick={() => allert(item.id, item.lampiran)}>Remove</p>
                      </td>
                  </tr>
                  )) : (
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td colSpan="7" className="px-6 py-4 text-center">Tidak ada laporan</td>
                    </tr>
                  )
                  }
                </tbody>
              </table>
            </div>
          </div>)}
      </AppLayout>
    </>
  )
}

export default withAuth(Dashboard, "admin")