'use client';

import AddButton from '@/components/ui/add-button';
import { ApiList } from '@/components/ui/api-list';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ColorColumn, columns } from './columns';

interface ColorClientProps {
	data: ColorColumn[];
}

export const ColorClient = ({ data }: ColorClientProps) => {
	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading title={`Colors: (${data.length})`} description='Manage colors for your store' />
				<AddButton route='colors' />
			</div>
			<Separator />
			<DataTable searchKey='name' columns={columns} data={data} />
			<Heading title='API' description='API calls for Colors' />
			<Separator />
			<ApiList entityName='colors' entityIdName='colorId' />
		</>
	);
};
