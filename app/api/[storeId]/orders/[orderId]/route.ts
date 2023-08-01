import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const DELETE = async (req: Request, { params }: { params: { storeId: string; orderId: string } }) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.orderId) {
			return new NextResponse('Order id is required', { status: 400 });
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

		const order = await prismadb.order.deleteMany({
			where: {
				id: params.orderId
			}
		});

		return NextResponse.json(order);
	} catch (error) {
		console.log('[ORDER_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};
