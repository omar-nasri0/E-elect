"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormatNumber from 'format-number'
import { Product } from '@prisma/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

function Page() {
    const format = FormatNumber({ prefix: '$', integerSeparator: "," })
    const [data, setData] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getProducts() {
            try {
                const res = await axios.get('/api/customer/getNew')
                setData(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 1500)
            }
        }
        getProducts()
    }, [])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
                [...Array(data.length)].map((_, index) => (
                    <Card key={index} className="flex flex-col max-w-xs">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-8 w-24" />
                        </CardFooter>
                    </Card>
                ))
            ) : (
                data.map((val, i) => (
                    <Card key={i} className="flex flex-col max-w-xs">
                        <div className="relative w-full h-52">
                            {/* <Image src={val.imagePath} alt={val.name} className="w-full h-full object-fill"/> */}
                            <Image src={val.imagePath} alt={val.name} className="w-full h-full object-fill" width={320}/>
                        </div>
                        <CardHeader>
                            <CardTitle>{val?.name}</CardTitle>
                            <CardDescription>{format(val.priceInCents / 100)}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="line-clamp-4">{val.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild size="lg">
                                <Link href={`products/${val.id}/purchase`}>Purchase</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            )}
        </div>
    )
}

export default Page
