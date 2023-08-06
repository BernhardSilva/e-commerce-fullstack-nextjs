'use client';

import AddButton from '@/components/ui/add-button';
import { ApiList } from '@/components/ui/api-list';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SizeColumn, columns } from './columns';

interface SizeClientProps {
	data: SizeColumn[];
}

export const SizeClient = ({ data }: SizeClientProps) => {

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading title={`Sizes: (${data.length})`} description='Manage sizes for your store' />
				<AddButton route='sizes' />
			</div>
			<Separator />
			<DataTable searchKey='name' columns={columns} data={data} />
			<Heading title='API' description='API calls for Sizes' />
			<Separator />
			<ApiList entityName='sizes' entityIdName='sizeId' />
		</>
	);
};
