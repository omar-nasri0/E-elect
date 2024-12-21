'use client';

import { useTransition } from 'react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Prop {
  id: string;
  isAvailableForPurchase: boolean;
}

export default function ActiveProducts({ id, isAvailableForPurchase }: Prop) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleToggle = () => {
    startTransition(async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/products/toggle', {
          
            id,
            isAvailableForPurchase: !isAvailableForPurchase,
          

        });
        console.log('Product availability toggled successfully:', response.data);
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
    <DropdownMenuItem disabled={isPending} onClick={handleToggle}
    className='cursor-pointer' >
      {isAvailableForPurchase ? 'Deactivate' : 'Activate'}
    </DropdownMenuItem>
  );
}
