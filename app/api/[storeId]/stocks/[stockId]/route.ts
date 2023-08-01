import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const GET = async (req: Request, { params }: { params: { stockId: string } }) => {
	try {
		if (!params.stockId) {
			return new NextResponse('Stock id is required', { status: 400 });
		}

		const stock = await prismadb.stock.findUnique({
			where: {
				id: params.stockId
			},
			include: {
				product: true
			}
		});

		return NextResponse.json(stock);
	} catch (error) {
		console.log('[STOCK_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};

export const PATCH = async (req: Request, { params }: { params: { storeId: string; stockId: string } }) => {
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

		const stockFound = await prismadb.stock.findFirst({
			where: {
				productId
			}
		});

		if (stockFound?.id !== params.stockId) {
			return new NextResponse('Product already has stock', { status: 400 });
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

		const stock = await prismadb.stock.updateMany({
			where: {
				id: params.stockId
			},
			data: {
				quantity,
				productId
			}
		});

		return NextResponse.json(stock);
	} catch (error) {
		console.log('[STOCK_PATCH]', error);

		return new NextResponse('Internal error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: { params: { storeId: string; stockId: string } }) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.stockId) {
			return new NextResponse('Stock id is required', { status: 400 });
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

		const stock = await prismadb.stock.delete({
			where: {
				id: params.stockId
			}
		});

		return NextResponse.json(stock);
	} catch (error) {
		console.log('[STOCK_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};
