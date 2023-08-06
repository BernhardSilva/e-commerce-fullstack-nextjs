'use client';

import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Size } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const formSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(1)
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
	initialData: Size | null;
}

export const SizeForm = ({ initialData }: SizeFormProps) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit size' : 'Create size';
	const description = initialData ? 'Edit size' : 'Add a new size';
	const toastMessage = initialData ? 'Size updated.' : 'Size created.';
	const action = initialData ? 'Save changes' : 'Create';

	const goBack = () => {
		router.push(`/${params.storeId}/sizes`);
	};

	const form = useForm<SizeFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || { name: '', value: '' }
	});

	const onSubmit = async (data: SizeFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
			} else {
				await axios.post(`/api/${params.storeId}/sizes`, data);
			}
			router.refresh();
			goBack();
			toast.success(toastMessage);
		} catch (error: any) {
			toast.error(error.response.data);
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
			router.refresh();
			router.push(`/${params.storeId}/sizes`);
			toast.success('Size deleted.');
		} catch (error) {
			toast.error('Make sure you removed all products using this size first.');
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<Button disabled={loading} variant='default' color='icon' onClick={goBack}>
				<ArrowLeft className='h-4 w-4' />
			</Button>
			<AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
			<div className='flex items-center justify-between'>
				<Heading title={title} description={description} />
				{initialData && (
					<Button disabled={loading} variant='destructive' size='icon' onClick={() => setOpen(true)}>
						<Trash className='h-4 w-4' />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<FormField
							name='name'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder='Size name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='value'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Size</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder='Size' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className='ml-auto' type='submit'>
						{action}
					</Button>
				</form>
			</Form>
			<Separator />
		</>
	);
};
