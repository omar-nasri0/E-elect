import { Table } from '@/components/ui/table'
import React from 'react'
import PageHeader from '../../../../components/PageHeader'
import ProductsForm from '../../../../components/ProductsForm'

function page() {
  const input = [{
    dec:'Name',
    htmlFor:'name',
    type:"text",
    id:'name',
    name:'name',
  },
{
  dec:"Price In Cents",
  htmlFor:'PriceInCents',
    type:'number',
    id:'PriceInCents',
    name:'PriceInCents',
},{
  dec:'Description',
  htmlFor:"description",
    type:"text",
    id:"description",
    name:"description",
},{
  dec:'File',
  htmlFor:"file",
    type:"file",
    id:"file",
    name:"file",
},{
  dec:'Image',
  htmlFor:"image",
    type:"file",
    id:"image",
    name:"image",
}]
  return (
    <div>
       <PageHeader>
        Add Products
       </PageHeader>
       <ProductsForm input={input}/>
    </div>
  )
}

export default page