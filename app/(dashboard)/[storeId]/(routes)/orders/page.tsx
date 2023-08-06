import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';
import { OrderClient } from './components/client';
import { OrderColumn } from './components/columns';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
	const orders = await prismadb.order.findMany({
		where: {
			storeId: params.storeId
		},
		include: {
			orderItems: {
				include: {
					product: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	
	const formattedOrders: OrderColumn[] = orders.map((item) => ({
		id: item.id,
		customer: item.customer,
		email: item.email,
		phone: item.phone,
		address: item.address,
		products: item.orderItems.map((orderItem) => `${orderItem.product.name} x${orderItem.quantity}`).join(', '),
		totalPrice: formatter.format(
			item.orderItems.reduce((sum, orderItem) => {
				const productPrice = Number(orderItem.product.price);
				const quantity = Number(orderItem.quantity);

				return sum + productPrice * quantity;
			}, 0)
		),
		isPaid: item.isPaid,
		isRefunded: item.isRefunded,
		createdAt: format(item.createdAt, 'MMMM do, yyyy')
	}));

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-4 sm:p-8 pt-6'>
				<OrderClient data={formattedOrders} />
			</div>
		</div>
	);
};

export default OrdersPage;
