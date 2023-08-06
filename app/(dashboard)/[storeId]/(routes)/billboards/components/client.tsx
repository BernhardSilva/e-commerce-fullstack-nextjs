'use client';

import AddButton from '@/components/ui/add-button';
import { ApiList } from '@/components/ui/api-list';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { BillboardColumn, columns } from './columns';

interface BillboardClientProps {
	data: BillboardColumn[];
}

export const BillboardClient = ({ data }: BillboardClientProps) => {

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading title={`Billboards: (${data.length})`} description='Manage billboards for your store' />
				<AddButton route='billboards' />
			</div>
			<Separator />
			<DataTable searchKey='label' columns={columns} data={data} />
			<Heading title='API' description='API calls for Billboards' />
			<Separator />
			<ApiList entityName='billboards' entityIdName='billboardId' />
		</>
	);
};
