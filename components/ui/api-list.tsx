'use client';

import { useOrigin } from '@/hooks/use-origin';
import { useParams } from 'next/navigation';
import { ApiALert } from '../modals/api-alert';

interface ApiListProps {
	entityName: string;
	entityIdName: string;
}

export const ApiList = ({ entityIdName, entityName }: ApiListProps) => {
	const params = useParams();
	const origin = useOrigin();

	const baseUrl = `${origin}/api/${params.storeId}`;

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
			<ApiALert title='GET' variant='public' description={`${baseUrl}/${entityName}`} />
			<ApiALert title='GET' variant='public' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
			<ApiALert title='POST' variant='admin' description={`${baseUrl}/${entityName}`} />
			<ApiALert title='PATCH' variant='admin' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
			<ApiALert title='DELETE' variant='admin' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
		</div>
	);
};
