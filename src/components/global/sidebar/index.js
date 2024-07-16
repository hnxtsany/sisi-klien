import React, { useEffect } from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import app from '@/config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import db from '@/config/firestore';
import { doc, getDoc } from '@firebase/firestore';

const Sidebar = () => {
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);
  const [user, setUser] = useState({});
  const menu = [
    {
      name: 'Dashboard',
      icon: '/assets/icons/dashboard.svg',
      link: '/admin/dashboard'
    },
    {
      name: 'Akun',
      icon: '/assets/icons/member.svg',
      link: '/admin/akun'
    },
    {
      name: 'Keluar',
      icon: '/assets/icons/logout.svg',
      link: '/auth/logout'
    }
  ];



  useEffect(() => {
    const auth = getAuth(app);
    try{
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const getUser = async () => {
            const userDoc = await getDoc(userRef);
            if(localStorage.getItem('user') === 'undefined' || localStorage.getItem('user') === null || JSON.parse(localStorage.getItem('user')).uid !== user.uid){
              if(userDoc.exists()){
                localStorage.setItem('user', JSON.stringify({
                  uid: user.uid,
                  ...userDoc.data()
                }));
              }
            }
          }
          getUser();
        } else {
          router.push('/auth/login');
        }
      });
    }
    catch (error) {
      console.error(error);
    }

    if(localStorage.getItem('user') !== null){
      setUser(JSON.parse(localStorage.getItem('user')));
    }

  }, []);



  

  return (
    <div>
      <div className='flex items-center justify-center py-5'>
        </div>
      {
        menu.map((item, index) => (
          <Link href={item.link} key={index}>
            <div className={`w-full px-5 py-4 flex justify-between items-center text-xs ${active == item.link ? "bg-[#F4F6F9]" : ""}`} key={index}>
              <div className=' flex items-center gap-2 font-medium'>
                <Image width={17} height={17} src={item.icon} />
                <p className='text-xs'>{item.name}</p>
              </div>
            </div>
          </Link>
        ))
      }
    </div>
  )
}

export default Sidebar