import withAuth from '@/components/global/withAuth'
import React from 'react'

const Admin = () => {
  return (
    <div>Admin</div>
  )
}

export default withAuth(Admin, "admin")