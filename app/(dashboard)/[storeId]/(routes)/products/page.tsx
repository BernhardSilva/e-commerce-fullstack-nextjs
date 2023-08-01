import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';
import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const products = await prismadb.product.findMany({
		where: {
			storeId: params.storeId
		},
		include: {
			category: true,
			size: true,
			color: true,
			stock: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	const formattedProducts: ProductColumn[] = products.map((item) => ({
		id: item.id,
		name: item.name,
		price: formatter.format(item.price.toNumber()),
		description: item.description,
		category: item.category.name,
		color: item.color.value,
		size: item.size.name,
		stock: item.stock[0]?.quantity.toString(),
		isFeatured: item.isFeatured,
		isArchived: item.isArchived,
		createdAt: format(item.createdAt, 'MMMM do, yyyy')
	}));

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<ProductClient data={formattedProducts} />
			</div>
		</div>
	);
};

export default ProductsPage;
