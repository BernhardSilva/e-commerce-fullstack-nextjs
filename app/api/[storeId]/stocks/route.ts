import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
	try {
		const { userId } = auth();
		const { quantity, productId } = await req.json();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!quantity) {
			return new NextResponse('Quantity is required', { status: 400 });
		}

		if (!productId) {
			return new NextResponse('Product id is required', { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId
			}
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthoriazed', { status: 403 });
		}

		const stockFound = await prismadb.stock.findFirst({
			where: {
				productId
			}
		});

		if (stockFound) {
			return new NextResponse('Product already has stock', { status: 400 });
		}

		const stock = await prismadb.stock.create({
			data: {
				storeId: params.storeId,
				productId,
				quantity
			}
		});

		return NextResponse.json(stock);
	} catch (error) {
		console.log('[STOCK_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
	try {
		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const stocks = await prismadb.stock.findMany({
			where: {
				storeId: params.storeId
			}
		});

		return NextResponse.json(stocks);
	} catch (error) {
		console.log('[STOCK_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
