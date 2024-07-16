import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "@/components/global/navbar";
import FormLaporan from "@/components/pages/home/formLaporan";
import Footer from "@/components/global/footer";
import { collection, getDocs } from "@firebase/firestore";
import db from "@/config/firestore";
import CardLaporan from "@/components/global/cardLaporan";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [laporan, setLaporan] = useState([]);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const getLaporan = async () => {
    setLoading(true);
    const laporanRef = collection(db, 'laporan');
    const snapshot = await getDocs(laporanRef);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setLaporan(data);
    setLoading(false);
  }

  useEffect(() => {
    getLaporan();
  }, []);



  
  return (
    <>
      <Head>
        <title>LABAS</title>
      </Head>
      <main>
        <Navbar />
        <section>
          <div className="bg-gradient-purple p-28">
            <div className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <h1 className="text-6xl text-white font-bold mb-3">LAPORAN BANJIR SEMARANG</h1>
                <p className="text-white text-center text-xl">
                  Sampaikan laporan banjir yang terjadi di sekitar anda
                </p>
              </div>
            </div>
          </div>
          <div className="px-40 py-36 "  id="form">
            <FormLaporan />
          </div>
        </section>
        <section className="px-28 py-10" id="laporan">
        <p className='font-bold text-3xl mb-5'>Laporan Pengguna</p>
        <div className="flex flex-wrap gap-10">
        {laporan.length > 0 ? laporan.map((item, index) => (
              <CardLaporan key={index} title={item.judul_laporan} content={item.laporan} image={item.lampiran} tanggal_kejadian={item.tanggal_kejadian} />
            )) : (
              <p className='text-center w-full col-span-4'>Tidak ada laporan</p>
            )}
        </div>
        </section>
        <section  className="px-28 py-10" id="">
          <p className='font-bold text-3xl mb-5'>Cara Mencegah Banjir</p>
          <ul className="flex flex-col gap-1">
          <li>1. Selalu membuang sampah pada tempatnya</li>
          <li>2. Membuat saluran air yang baik</li>
          <li>3. Memperbanyak lahan penyerapan air</li>
          <li>4. Tidak membangun Perumahan di tepi sungai</li>
          <li>5. Reboisasi tanaman khususnya yang dapat menyerap air</li>
          <li>6. Buat Fungsi sungai dan selokan dapat bekerja dengan baik</li>
          <li>7. Tidak menebang poho di hutan secara liar</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
