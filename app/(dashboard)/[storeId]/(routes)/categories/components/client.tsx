'use client';

import AddButton from '@/components/ui/add-button';
import { ApiList } from '@/components/ui/api-list';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CategoryColumn, columns } from './columns';

interface CatetoryClientProps {
	data: CategoryColumn[];
}

export const CategoryClient = ({ data }: CatetoryClientProps) => {

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading title={`Categories: (${data.length})`} description='Manage categories for your store' />
				<AddButton route='categories'/>
			</div>
			<Separator />
			<DataTable searchKey='name' columns={columns} data={data} />
			<Heading title='API' description='API calls for Categories' />
			<Separator />
			<ApiList entityName='categories' entityIdName='categoryId' />
		</>
	);
};
