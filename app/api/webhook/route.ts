import Stripe from 'stripe';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

//after installing stripe on your server and login and getting the secret from stripe

export async function POST(req: Request) {
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
	console.log('🚀 ~ file: route.ts:34 ~ POST ~ addressString:', addressString);

	if (event.type === 'checkout.session.completed') {
		console.log('COMPLETED!');
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

		console.log('🚀 ~ file: route.ts:53 ~ POST ~ order:', order);

		for (const orderItem of order.orderItems) {
			console.log("🚀 ~ file: route.ts:60 ~ POST ~ orderItem:", orderItem)
			const productId = orderItem.productId;
			console.log("🚀 ~ file: route.ts:61 ~ POST ~ productId:", productId)
			const quantity = orderItem.quantity;
			console.log("🚀 ~ file: route.ts:62 ~ POST ~ quantity:", quantity)
			const stockUpdate = await prismadb.stock.update({
				where: {
					id: productId
				},
				data: {
					quantity: {
						decrement: quantity
					}
				}
			});
			stockUpdate
			console.log("🚀 ~ file: route.ts:76 ~ POST ~ stockUpdate:", stockUpdate)
		}

		const productIds = order.orderItems.map((orderItem) => orderItem.productId);

		await prismadb.product.updateMany({
			where: {
				id: {
					in: [...productIds]
				}
			},
			data: {}
		});
	}

	return new Response(null, { status: 200 });
}
