'use client'

import React from 'react'
import CreateAuctionForm from '@components/Auction/AuctionForm'
import { useSession } from 'next-auth/react'
const page = () => {
  const { data: session, status } = useSession();
  return (
    <div>
      {status==='authenticated' && session && <CreateAuctionForm userId={session.user.id} />}
    </div>
  )
}

export default page
