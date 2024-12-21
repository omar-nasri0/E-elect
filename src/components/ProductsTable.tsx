
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/utils/dp'
import { CheckCircle, CheckCircle2,  MoreVertical, XCircle } from 'lucide-react'
import formatNumber from "format-number"
import { DropdownMenu, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import Link from 'next/link'
import ProductActive from '@/components/ProductActive'
import DeleteProducts from '@/components/DeletProducts'
async function ProductsTable() {
    const formatCurrency = formatNumber({prefix:"$" , integerSeparator:","})
    const formatOrder = formatNumber({prefix:"" , integerSeparator:","})
    const products =await prisma.product.findMany({
        select:{
            id:true,
            name:true,
            priceInCents:true,
            isAvailableForPurchase:true,
            _count:{select:{order:true}}
        },
        orderBy:{name:"asc"}
    })
    if( products.length===0 )
        {return <p className='flex justify-center text-2xl text-red-600'>No Products found </p>}
  return (
    <div>
        <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-0'>
                            <span className='sr-only'>Available For Purchase</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead></TableHead>
                        <TableHead className='w-0'>
                            <span className='sr-only'>Action</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map(product =>(
                        <TableRow key={product.id}>
                            <TableCell>
                        {product.isAvailableForPurchase ? 
                        <CheckCircle2 className='stroke-green-500' /> : <XCircle className='stroke-destructive' />}
                            </TableCell>

                            <TableCell>{product.name}</TableCell>
                            <TableCell>{formatCurrency(product.priceInCents/100)}</TableCell>
                            <TableCell>{formatOrder(product._count.order)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical/>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild className='cursor-pointer'>
                                           
                                           <Link href={`/admin/products/${product.id}/edit`}>
                                            Edit</Link>
                                            </DropdownMenuItem>
                                            <ProductActive id={product.id} isAvailableForPurchase={product.isAvailableForPurchase}/>
                                            <DeleteProducts id={product.id} disabled={product._count.order>0}/>
                                                
                                        
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
    </div>
  )
}

export default ProductsTable