'use client';

import axios from 'axios';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AlertModal } from '@/components/modals/alert-modal';
import { ApiALert } from '@/components/modals/api-alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useOrigin } from '@/hooks/use-origin';

interface SettingsFormProps {
	initialData: Store;
}

const formSchema = z.object({
	name: z.string().min(1)
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
	});

	const onSubmit = async (data: SettingsFormValues) => {
		try {
			setLoading(true);
			await axios.patch(`/api/stores/${params.storeId}`, data);
			router.refresh();
			toast.success('Store updated');
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
			await axios.delete(`/api/stores/${params.storeId}`);
			router.refresh();
			router.push('/');
			toast.success('Store deleted.');
		} catch (error: any) {
			// toast.error('Make sure you removed all billboards products and categories first');
			toast.error(error.response.data);
			console.error(error);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
				title={`You are trying to remove ${initialData.name} store.`}
				message='If you want to permanently delete your store, you must delete all products and categories associated with this store.
				If you are sure about this action, we advise you to reconsider, because this action cannot be undone.'
			/>
			<div className='flex items-center justify-between'>
				<Heading title='Settings' description='Manage store preferences' />
				<Button disabled={loading} variant='destructive' size='icon' onClick={() => setOpen(true)}>
					<Trash className='h-4 w-4' />
				</Button>
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							name='name'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder='Store name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className='ml-auto' type='submit'>
						Save changes
					</Button>
				</form>
			</Form>
			<Separator />
			<ApiALert title='GET' description={`${origin}/api/stores/{storeId}`} variant='public' />
			<ApiALert title='NEXT_PUBLIC_API_URL' description={`${origin}/api/${params.storeId}`} variant='public' />
		</>
	);
};
