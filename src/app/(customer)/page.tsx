
import React from 'react'
import GetSixPopProducts from '@/components/GetSixPopProducts'
import GetSixNew from '@/components/GetSixNew' 
import {  ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
    

function page() {
  return (
    <div >
        <div className="flex justify-between">
        <div className="flex gap-10 items-center my-5">
        <h3 className='font-semibold text-2xl'>Most Popular</h3>
        <Button asChild><Link href='/products'>View All <ArrowRight/></Link></Button>
        </div>
        <div className=""><Button asChild><Link href='/admin/products'>go back to admin pages<ArrowRight/></Link></Button></div>
        </div>
        <GetSixPopProducts/>
        <div className="flex gap-10 items-center my-5">
        <h3 className='font-semibold text-2xl'>Newest</h3>
        <Button asChild><Link href='/products'>View All <ArrowRight/></Link></Button>
        </div>
        <GetSixNew/>
        </div>
  )
}

export default page