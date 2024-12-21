
import PageHeader from '../../../components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ProductsTable from '@/components/ProductsTable'

export default function page() {
  return (
  <>
  <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
            <Link href='products/new'>Add Product</Link>
        </Button>
        
    </div>
  <ProductsTable/>
  <Button asChild className='mt-10'>
            <Link href='/'>Show more Info about Products</Link>
        </Button>
  </>
    
  )
}
