'use client'

import { useTransition } from 'react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import axios from 'axios';
import { useRouter } from 'next/navigation';
interface Prop {
  id: string;
  disabled: boolean;
}

export default function  ActiveProducts({ id, disabled }: Prop) {
  const [isPending, startTransition] = useTransition();
  
  const router = useRouter();
  const handleDelete = () => {
    startTransition( async () => {
      try {
        const response = await  axios.post('http://localhost:3000/api/products/delete', {
          id
        });
        console.log('Product availability toggled successfully:', );
        router.refresh(); 
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('Error message:', err.message);
          if (err.response) {
            console.error('Error response data:', err.response.data);
          }
        } else {
          console.error('Unexpected error:', err);
        }
      }
    });
  };

  return (
    <DropdownMenuItem 
    disabled={disabled || isPending} onClick={handleDelete}
    className='cursor-pointer text-red-500 hover:text-red-500 '>
      Delete Product
    </DropdownMenuItem>
  );
}
