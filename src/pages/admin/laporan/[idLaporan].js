import AppLayout from '@/components/global/appLayout';
import db from '@/config/firestore';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { getDownloadURL } from '@firebase/storage';
import Head from 'next/head';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Swal from 'sweetalert2';
import withAuth from '@/components/global/withAuth';

const Index = () => {
    const router = useRouter();
    const idLaporan = router.query.idLaporan;
    const [laporan, setLaporan] = useState({});
    const [loading, setLoading] = useState(true);

    const allert = (status, message) => {
        Swal.fire({
            icon: status,
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    }

    const handleUpdateStatus = async (status) => {
        try {
            const docRef = doc(db, 'laporan', idLaporan);
            await setDoc(docRef, {
                status: status
            }, { merge: true });
            allert('success', 'Status berhasil diubah');
            router.push('/admin/dashboard');
        } catch (e) {
            allert('error', 'Status gagal diubah');
            console.error(e.message);
            router.push('/admin/dashboard');
        }
    }

    useEffect(() => {
        const getArtikel = async () => {
            try {
                if(idLaporan === undefined){
                    return;
                }
                const docRef = doc(db, 'laporan', idLaporan);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setLaporan(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (e) {
                console.error(e.message);
            } finally {
                setLoading(false);
            }
        };

        getArtikel();
    }, [idLaporan]);
  return (
    <>
        <Head>
            <title>{laporan.judul_laporan ? laporan.judul_laporan : "Tidak Ditemukan"}</title>
        </Head>
        <AppLayout>
        <div className='w-auto m-10 bg-white px-6 py-4 rounded-md shadow-md'>
                <p className='text-[#3A405B] font-medium text-xl'>Detail Laporan</p>
                <div className='mt-4' >
                    <div className='grid grid-cols-1 gap-6'>
                        <div className='h-[10rem] w-[15rem]'>
                            <Image src={laporan.lampiran} alt='gambar' width={0} height={0} objectFit='cover' sizes='10' className='rounded-md w-full h-full object-cover' />
                        </div>
                        <div>
                            <label className='text-sm' >Judul</label>
                            <input type='text' id='title' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='judul_laporan' value={laporan.judul_laporan} disabled/>
                        </div>
                        <div>
                            <label className='text-sm' >Tanggal Kejadian</label>
                            <input type='text' id='title' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='tanggal_kejadian' value={laporan.tanggal_kejadian} disabled/>
                        </div>
                        <div>
                            <label className='text-sm' >Kabupaten</label>
                            <input type='text' id='title' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='kabupaten' value={laporan.kabupaten} disabled/>
                        </div>
                        <div>
                            <label className='text-sm' >Kecamatan</label>
                            <input type='text' id='title' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='kecamatan' value={laporan.kecamatan} disabled/>
                        </div>
                        <div>
                            <label className='text-sm' >Kelurahan</label>
                            <input type='text' id='title' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='kelurahan' value={laporan.kelurahan} disabled/>
                        </div>
                        <div>
                            <label className='text-sm' >Laporan</label>
                            <textarea type='text' id='title' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm resize-none' name='laporan' value={laporan.laporan} disabled/>
                        </div>
                        <div className='flex gap-2'>
                            <button className='bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 disabled:bg-yellow-900' disabled={laporan.status == "Proses" || laporan.status == "Selesai"} onClick={() => handleUpdateStatus("Proses")}>Proses</button>
                            <button className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:bg-green-900' disabled={laporan.status == "Selesai"} onClick={() => handleUpdateStatus("Selesai")}>Selesai</button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    </>
  )
}

export default withAuth(Index, "admin")