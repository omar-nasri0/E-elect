import PageHeader from '@/components/PageHeader';
import ProductFormUpdate from '@/components/ProductFormUpdeat';
import prisma from '@/utils/dp';
import React from 'react';

async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log("Product ID:", id); // Add logging to check the value of id

  const input = [
    { name: 'name' },
    { name: 'PriceInCents' },
    { name: 'description' },
    { name: 'file' },
    { name: 'image' },
  ];

  const edit = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      priceInCents: true,
      description: true,
      filePath: true,
      imagePath: true,
    },
  });

  if (!edit) {
    return (
      <div>
        <PageHeader>Product Not Found</PageHeader>
        <p>Sorry, the product you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader>Edit Product</PageHeader>
      <ProductFormUpdate input={input} edit={edit} />
    </div>
  );
}

export default page;
