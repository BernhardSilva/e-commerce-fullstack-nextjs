import React from 'react';
import { Button } from './button';
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface AddButtonProps {
	route: string;
}

const AddButton = ({ route }: AddButtonProps) => {
	const router = useRouter();
	const params = useParams();

	return (
		<Button onClick={() => router.push(`/${params.storeId}/${route}/new`)} className='sm:w-auto w-[40px] rounded-full'>
			<Plus className='mr-2 h-4 w-4' />
			<span className='hidden sm:block'>Add new</span>
			<span className='block sm:hidden'>
				<Plus className='mr-2 h-4 w-4' />
			</span>
		</Button>
	);
};

export default AddButton;
