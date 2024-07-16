
import AppLayout from '@/components/global/appLayout'
import Head from 'next/head'
import React, { useState } from 'react'
import Image from 'next/image'
import kabupaten from '@/data/kabupaten.json'
import kecamatan from '@/data/kecamatan.json'
import kelurahan from '@/data/kelurahan.json'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@firebase/storage'
import Swal from 'sweetalert2'
import { addDoc, collection, serverTimestamp } from '@firebase/firestore'
import db from '@/config/firestore'
import { useRouter } from 'next/router'

const FormLaporan = () => {
    const [kabupatenList, setKabupatenList] = useState(kabupaten);
    const [kecamatanList, setKecamatanList] = useState([]);
    const [kelurahanList, setKelurahanList] = useState([]);
    const [file, setFile] = useState(null);
    const router = useRouter();

    const [form, setForm] = useState({
        judul_laporan: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
        laporan: '',
        file: '',
        tanggal_kejadian: ''
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });

        if (name === 'kabupaten') {
            const selectedKabupaten = JSON.parse(value);
            setKecamatanList(kecamatan.filter((item) => item.idKabupaten === selectedKabupaten.id));
        } else if (name === 'kecamatan') {
            const selectedKecamatan = JSON.parse(value);
            setKelurahanList(kelurahan.filter((item) => item.idKecamatan === selectedKecamatan.id));
        }
    }




    const onChangeFile = (e) => {
        const file = e.target.files[0];
        setFile(file);
    }

    const onSubmit = (e) => {
        console.log(form);
        if (form.judul_laporan === '' || form.kabupaten === '' || form.kecamatan === '' || form.kelurahan === '' || form.laporan === '' || file === null) {
            allert({
                status: 'error',
                message: 'Semua data harus diisi'
            });
        } else {
            handleUpload();
        }
        e.preventDefault();

    }

    const allert = ({ status, message }) => {
        Swal.fire({
            icon: status,
            title: message,
            showConfirmButton: false,
            timer: 1500
        })
    }

    const handleUpload = async () => {
        const storage = getStorage();
        try {
            const storageRef = ref(storage, 'laporan/' + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                allert({
                    status: 'info',
                    message: 'Upload is running'
                });
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }


            }, (error) => {
                console.log(error);
                allert({
                    status: 'error',
                    message: 'Laporan gagal diupload'
                });
            }
                , () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        uploadFirestore({
                            url_file: downloadURL
                        });
                    });
                    setTimeout(() => {
                        allert({
                            status: 'success',
                            message: 'Laporan berhasil diupload'
                        });
                        router.reload();
                    }, 2000);
                });

        } catch (error) {
            console.log(error);
            allert({
                status: 'error',
                message: 'Laporan gagal diupload'
            });
        }
    }

    const uploadFirestore = async ({
        url_file
    }) => {
        try {
            const docRef = await addDoc(collection(db, "laporan"), {
                judul_laporan: form.judul_laporan,
                kabupaten: JSON.parse(form.kabupaten).kabupaten,
                kecamatan: JSON.parse(form.kecamatan).kecamatan,
                kelurahan: form.kelurahan,
                laporan: form.laporan,
                lampiran: url_file,
                status: 'Belum Tertangani',
                tanggal_kejadian: form.tanggal_kejadian,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            console.log("Document written with ID: ", docRef.id);
        }
        catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return (
        <div className='w-auto bg-white px-6 py-4 rounded-md shadow-md'>
            <p className='font-bold text-3xl mb-5'>Form Laporan</p>
            <div className='mt-4' >
                <form onSubmit={onSubmit}>
                    <div className='grid grid-cols-1 gap-6'>
                        <div>
                            <label className='text-sm'>Judul Laporan</label>
                            <input type='text' id='judul_laporan' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='judul_laporan' onChange={onChange} />
                        </div>
                        <div>
                            <label className='text-sm'>Tanggal Kejadian</label>
                            <input type='date' id='tanggal_kejadian' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='tanggal_kejadian' onChange={onChange} />
                        </div>
                        <div>
                            <label className='text-sm'>Kabupaten</label>
                            <select id='kabupaten' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='kabupaten' onChange={onChange}>
                                <option value=''>Pilih Kabupaten</option>
                                {kabupatenList.map((item, index) => (
                                    <option value={JSON.stringify(
                                        {
                                            id: item.id,
                                            kabupaten: item.kabupaten
                                        }
                                    )} key={index}>{item.kabupaten}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='text-sm'>Kecamatan</label>
                            <select id='kecamatan' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='kecamatan' onChange={onChange}>
                                <option value=''>Pilih Kecamatan</option>
                                {kecamatanList.map((item, index) => (
                                    <option value={JSON.stringify(
                                        {
                                            id: item.id,
                                            kecamatan: item.kecamatan
                                        }
                                    )} key={index}>{item.kecamatan}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='text-sm'>Kelurahan</label>
                            <select id='kelurahan' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' name='kelurahan' onChange={onChange}>
                                <option value=''>Pilih Kelurahan</option>
                                {kelurahanList.map((item, index) => (
                                    <option value={item.kelurahan} key={index}>{item.kelurahan}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='text-sm'>Laporan</label>
                            <textarea id='laporan' name='laporan' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm resize-none h-[10rem]' onChange={onChange}  ></textarea>
                        </div>
                        <div>
                            <label className='text-sm'>File Lampiran</label>
                            <input type='file' id='file' name='file' className='border border-[#E0E0E0] rounded-md w-full py-2 px-3 text-sm' onChange={onChangeFile} accept="application/pdf, image/jpg, image/png, image/jpeg" />
                            <p className='text-xs text-gray-500'>*File harus berformat .jpg, .jpeg, .png</p>
                        </div>
                    </div>
                    <button type='submit' className='bg-primary-purple text-white rounded-md py-2 px-4 mt-4'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default FormLaporan