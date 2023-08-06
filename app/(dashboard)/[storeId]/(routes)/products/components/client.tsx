'use client';

import AddButton from '@/components/ui/add-button';
import { ApiList } from '@/components/ui/api-list';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useParams, useRouter } from 'next/navigation';
import { ProductColumn, columns } from './columns';

interface ProductClientProps {
	data: ProductColumn[];
}

export const ProductClient = ({ data }: ProductClientProps) => {

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading title={`Products: (${data.length})`} description='Manage products for your store' />
				<AddButton route='products' />
			</div>
			<Separator />
			<DataTable searchKey='name' columns={columns} data={data} />
			<Heading title='API' description='API calls for Products' />
			<Separator />
			<ApiList entityName='products' entityIdName='productId' />
		</>
	);
};
