'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { copyClipboard } from '@/hooks/use-copy';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { ProductColumn } from './columns';

interface CellActionProps {
	data: ProductColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const params = useParams();

	const onCopy = () => {
		copyClipboard(data.id, 'id copied');
	};

	const onUpdate = () => {
		router.push(`/${params.storeId}/products/${data.id}`);
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/products/${data.id}`);
			router.refresh();
			toast.success('Product deleted.');
		} catch (error) {
			toast.error('Something went wrong.');
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className='h-8 w-8 p-0' variant='ghost'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={onUpdate}>
						<Edit className='mr-2 h-4 w-4' />
						Update
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onCopy}>
						<Copy className='mr-2 h-4 w-4' />
						Copy id
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className='mr-2 h-4 w-4' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
