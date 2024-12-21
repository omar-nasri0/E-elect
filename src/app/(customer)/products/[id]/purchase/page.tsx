import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div className='flex justify-center  '>
        <p className='text-2xl'>Ops! This page is currently unavailable 
            <span className='block'>We will work to activate it soon</span>
            <span>We are Sorry My Friends</span>
            <Button asChild className='block'>
                <Link href='/products' className='text-center'>Go back to Products</Link>
                </Button></p>
    </div>
  )
}

export default page