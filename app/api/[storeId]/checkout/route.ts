import Stripe from 'stripe';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';
import { Product, Stock } from '@prisma/client';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function OPTIONS() {
	return NextResponse.json({}, { headers: corsHeaders });
}

interface ProductCheckout extends Product {
	quantityItem: number;
	stock: Stock[];
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
	const { items } = await req.json();
	const productsArray: ProductCheckout[] = items;
	console.log('🚀 ~ file: route.ts:23 ~ productsArray ~ productsArray:', productsArray);

	console.log('🚀 ~ file: route.ts:20 ~ POST ~ items:', items);
	// console.log('🚀 ~ file: route.ts:19 ~ POST ~ productIds:', productIds);

	if (!productsArray || productsArray.length === 0) {
		return new NextResponse('Products are required', { status: 400 });
	}
	console.log('🚀 ~ file: route.ts:31 ~ POST ~ productsArray.length :', productsArray.length);

	// const products = await prismadb.product.findMany({
	// 	where: {
	// 		id: {}
	// 	}
	// });

	//Insert quantities into products
	// const productsMapped = products.map((product, index) => ({
	// 	...product,
	// 	quantity: quantities[index]
	// }));

	const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

	productsArray.forEach((product: ProductCheckout) => {
		line_items.push({
			quantity: product.quantityItem,
			price_data: {
				currency: 'USD',
				product_data: {
					name: product.name
				},
				//because it's decimal we do *100
				unit_amount: Math.round(Number(product.price) * 100)
			}
		});
	});

	console.log(line_items);

	const order = await prismadb.order.create({
		data: {
			storeId: params.storeId,
			isPaid: false,
			orderItems: {
				create: productsArray.map((product) => ({
					product: {
						connect: {
							id: product.id
						}
					},
					quantity: product.quantityItem
				}))
			}
		},
		include: {
			orderItems: true
		}
	});
	console.log('🚀 ~ file: route.ts:69 ~ POST ~ order:', order);

	const sessionCheckout = await stripe.checkout.sessions.create({
		line_items,
		mode: 'payment',
		billing_address_collection: 'required',
		phone_number_collection: {
			enabled: true
		},
		success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
		cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
		metadata: {
			orderId: order.id
		}
	});
	
	console.log('🚀 ~ file: route.ts:99 ~ POST ~ sessionCheckout:', sessionCheckout);

	productsArray.forEach(async (product) => {
		await prismadb.stock.updateMany({
			where: {
				storeId: params.storeId,
				productId: product.id
			},
			data: {
				quantity: product.stock[0].quantity - product.quantityItem
			}
		});
	});

	return NextResponse.json(
		{ url: sessionCheckout.url },
		{
			headers: corsHeaders
		}
	);
}
