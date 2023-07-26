'use client';

import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Color, Image, Product, Size } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const formSchema = z.object({
	name: z.string().min(1),
	price: z.coerce.number().min(1),
	description: z.string().max(2000).optional(),
	images: z.object({ url: z.string() }).array(),
	categoryId: z.string().min(1),
	colorId: z.string().min(1),
	sizeId: z.string().min(1),
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional()
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
	initialData:
		| (Product & {
				images: Image[];
		  })
		| null;
	categories: Category[] | null;
	colors: Color[] | null;
	sizes: Size[] | null;
}

export const ProductForm = ({ initialData, categories, colors, sizes }: ProductFormProps) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit product' : 'Create product';
	const desc = initialData ? 'Edit product' : 'Add a new product';
	const toastMessage = initialData ? 'Product updated.' : 'Product created.';
	const action = initialData ? 'Save changes' : 'Create';

	const goBack = () => {
		router.push(`/${params.storeId}/products`);
	};

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					...initialData,
					price: parseFloat(String(initialData?.price))
			  }
			: {
					name: '',
					price: 0,
					description: '',
					categoryId: '',
					colorId: '',
					sizeId: '',
					isFeatured: false,
					isArchived: false,
					images: []
			  }
	});

	const onSubmit = async (data: ProductFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
			} else {
				await axios.post(`/api/${params.storeId}/products`, data);
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
			await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
			router.refresh();
			router.push(`/${params.storeId}/products`);
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
			<Button disabled={loading} variant='default' color='icon' onClick={goBack}>
				<ArrowLeft className='h-4 w-4' />
			</Button>
			<AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
			<div className='flex items-center justify-between'>
				<Heading title={title} description={desc} />
				{initialData && (
					<Button disabled={loading} variant='destructive' size='icon' onClick={() => setOpen(true)}>
						<Trash className='h-4 w-4' />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
					<div className='flex'>
						<FormField
							name='images'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Images</FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value.map((image) => image.url)}
											disabled={loading}
											onChange={(url) => field.onChange([...field.value, { url }])}
											onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
											options={{ maxFiles: initialData ? 6 - field.value.length : 6, maxFileSize: 300000 }}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='grid sm:grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5'>
						<FormField
							name='name'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder='Product name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='price'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder='9.99' type='number' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='categoryId'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Categories</FormLabel>
									<FormControl>
										<Select
											disabled={loading}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue defaultValue={field.value} placeholder='Select a category' />
													<SelectContent>
														{categories?.map((category) => (
															<SelectItem key={category.id} value={category.id}>
																{category.name}
															</SelectItem>
														))}
													</SelectContent>
												</SelectTrigger>
											</FormControl>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='colorId'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Color</FormLabel>
									<FormControl>
										<Select
											disabled={loading}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue defaultValue={field.value} placeholder='Select a color' />
													<SelectContent>
														{colors?.map((color) => (
															<SelectItem key={color.id} value={color.id} className='flex d-inline-flex'>
																<div className='flex d-inline-flex gap-2'>
																	<div
																		className='border p-[10px] rounded-full'
																		style={{ backgroundColor: color.value }}
																	/>
																	{color.name}
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</SelectTrigger>
											</FormControl>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='sizeId'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Size</FormLabel>
									<FormControl>
										<Select
											disabled={loading}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue defaultValue={field.value} placeholder='Select a size' />
													<SelectContent>
														{sizes?.map((size) => (
															<SelectItem key={size.id} value={size.id}>
																{size.name}
															</SelectItem>
														))}
													</SelectContent>
												</SelectTrigger>
											</FormControl>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='isFeatured'
							control={form.control}
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											//@ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Featured</FormLabel>
										<FormDescription>This product will appear on the home page</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							name='isArchived'
							control={form.control}
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											//@ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Archived</FormLabel>
										<FormDescription>This product will not appear anywhere in the store</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>
					<FormField
						name='description'
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										className='h-5'
										disabled={loading}
										placeholder='Add description of the product here...'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={loading} className='ml-auto' type='submit'>
						{action}
					</Button>
				</form>
			</Form>
			<Separator />
		</>
	);
};
