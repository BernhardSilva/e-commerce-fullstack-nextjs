import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

//after installing stripe on your server and login and getting the secret from stripe
export async function POST(req: Request) {
	try {
		const body = await req.text();
		const signature = headers().get('Stripe-Signature') as string;

		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
		} catch (error: any) {
			return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
		}

		const session = event.data.object as Stripe.Checkout.Session;
		const address = session?.customer_details?.address;
		const phone = session?.customer_details?.phone || '';
		const customer = session?.customer_details?.name || '';
		const email = session?.customer_details?.email || '';

		const addressComponents = [
			address?.line1,
			address?.line2,
			address?.city,
			address?.state,
			address?.postal_code,
			address?.country
		];

		const addressString = addressComponents.filter((c) => c !== null).join(', ');
		console.log('🚀 POST addressString:', addressString);

		if (event.type === 'checkout.session.completed') {
			console.log('PAYMENT COMPLETED!');

			const order = await prismadb.order.update({
				where: {
					id: session?.metadata?.orderId
				},
				data: {
					isPaid: true,
					address: addressString,
					phone,
					customer,
					email
				},
				include: {
					orderItems: true
				}
			});

			console.log('🚀 POST order:', order);

			const orderItems = order.orderItems;
			const storeId = order.storeId;

			// Group the orderItems by productId and sum up the quantities
			const quantitiesByProductId = orderItems.reduce((map, orderItem) => {
				const { productId, quantity } = orderItem;
				return map.set(productId, (map.get(productId) ?? 0) + quantity);
			}, new Map<string, number>());

			// Update the stock for each productId
			await Promise.all(
				Array.from(quantitiesByProductId.entries()).map(async ([productId, quantity]) => {
					console.log(`Updating stock for product <${productId}> with quantity <${quantity}>`);
					await prismadb.stock.updateMany({
						where: { productId, storeId },
						data: {
							quantity: {
								decrement: quantity
							}
						}
					});
				})
			);
		}
		return new Response(null, { status: 200 });
	} catch (error: any) {
		console.error(`Error: ${error.message}`);
		return new NextResponse(`Error: ${error.message}`, { status: 500 });
	}
}
