import AppLayout from '@/components/global/appLayout'
import app from '@/config/firebase'
import { getAuth } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Index = () => {
    const router = useRouter()
    const auth = getAuth(app);
    useEffect(() => {
        localStorage.removeItem('user')
        auth.signOut().then(() => {
            router.push('/auth/login');
        });
    }, [])
  return (
    <>
    <AppLayout>
        
    </AppLayout>
    </>
  )
}

export default Index