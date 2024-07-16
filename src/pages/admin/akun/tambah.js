import AppLayout from '@/components/global/appLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Image from 'next/image';
import withAuth from '@/components/global/withAuth';
import { registerWithEmailAndPassword } from '@/service/auth'
import { doc, setDoc } from '@firebase/firestore';
import db from '@/config/firestore';
import Swal from 'sweetalert2';

const Index = () => {
    const router = useRouter();
    const [error, setError] = useState(null);

    const [from, setFrom] = useState({
        fullname: '',
        email: '',
        password: ''
    });

    const onchange = (e) => {
        setFrom({
            ...from,
            [e.target.name]: e.target.value
        })
    }
    
    const submit = async (e) => {
        e.preventDefault();
        try {
            if (from.fullname === '') {
                setError('Nama Lengkap tidak boleh kosong');
                return;
            }
            if (from.email === '') {
                setError('Email tidak boleh kosong');
                return;
            }
            if (from.password === '') {
                setError('Password tidak boleh kosong');
                return;
            }
            
            const response = await registerWithEmailAndPassword({
                fullname: from.fullname,
                email: from.email,
                password: from.password
            });
            
            if (response.status === "success") {
                uploadFirestore(response.data.uid);
                allert({
                    status: "success",
                    message: "Akun berhasil ditambahkan"
                });
                router.push('/admin/akun');
            }
            else {
                setError(response.data);
            }
        }
        catch (e) {
            throw Error(e.message);
        }
    }
    
    const uploadFirestore = async (uid) => {
        try {
            const docRef = await setDoc(doc(db, "users", uid), {
                fullname: from.fullname,
                email: from.email,
                role : 'admin'
            });
        }catch(e){
            throw Error(e.message);
        }
    }

    const allert = ({status, message}) => {
        Swal.fire({
            title: status,
            text: message,
            icon: status,
            confirmButtonText: 'OK'
        });
    }





    return (
        <>
            <Head>
                <title>Tambah Akun</title>
            </Head>
            <AppLayout>
                <div className='w-auto m-24 bg-white px-6 py-4 rounded-md shadow-md'>
                    <p className='text-[#3A405B] font-medium text-xl'>Tambah Akun</p>
                    <form onSubmit={submit}>
                        <div className='mt-4' >
                            <div className='grid grid-cols-1 gap-6'>
                                <div>
                                    <label className='text-sm' >Nama Lengkap</label>
                                    <input type='text' id='title' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='fullname' onChange={onchange} />
                                </div>
                                <div>
                                    <label className='text-sm' >Email</label>
                                    <input type='text' id='email' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='email' onChange={onchange} />
                                </div>
                                <div>
                                    <label className='text-sm' >Passoword</label>
                                    <input type='password' id='password' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='password' onChange={onchange} />
                                </div>
                                <div>
                                    <p className='text-red-500 text-sm'>{error}</p>
                                </div>
                                <div>
                                    <button type='submit' className='bg-[#3A405B] text-white rounded-md py-2 px-4'>Tambah</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </AppLayout>
        </>
    )
}

export default withAuth(Index, "admin")