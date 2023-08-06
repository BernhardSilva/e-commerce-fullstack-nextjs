'use client';

import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Color } from '@prisma/client';
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
	value: z.string().min(4).regex(/^#/, {
		message: 'String must be a valid hex code'
	})
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
	initialData: Color | null;
}

export const ColorForm = ({ initialData }: ColorFormProps) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit color' : 'Create color';
	const description = initialData ? 'Edit color' : 'Add a new color';
	const toastMessage = initialData ? 'Color updated.' : 'Color created.';
	const action = initialData ? 'Save changes' : 'Create';

	const goBack = () => {
		router.push(`/${params.storeId}/colors`);
	};

	const form = useForm<ColorFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || { name: '', value: '' }
	});

	const onSubmit = async (data: ColorFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
			} else {
				await axios.post(`/api/${params.storeId}/colors`, data);
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
			await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
			router.refresh();
			router.push(`/${params.storeId}/colors`);
			toast.success('Color deleted.');
		} catch (error) {
			toast.error('Make sure you removed all products using this color first.');
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
					<Button disabled={loading} variant='destructive' color='icon' onClick={() => setOpen(true)}>
						<Trash className='h-4 w-4' />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
					<div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
						<FormField
							name='name'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder='Color name' {...field} />
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
									<FormLabel>Color</FormLabel>
									<FormControl>
										<div className='flex items-center gap-x-4'>
											<Input
												className='border w-10 h-10 cursor-pointer p-0'
												disabled={loading}
												type='color'
												{...field}
											/>
											<Input
												className='border p-1.5 rounded-md'
												disabled={loading}
												placeholder='Hex value'
												{...field}
											/>
										</div>
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
