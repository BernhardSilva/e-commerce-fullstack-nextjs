import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
interface Store {
	id: string;
	name: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}
import { NextResponse } from 'next/server';

export const PATCH = async (req: Request, { params }: { params: { storeId: string } }) => {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { name } = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const storeFound = await prismadb.store.findFirst({
			where: {
				name
			}
		});

		if (storeFound && storeFound.id !== params.storeId) {
			return new NextResponse('Store is used, choose a different name', { status: 400 });
		}

		const store = await prismadb.store.updateMany({
			where: {
				id: params.storeId,
				userId
			},
			data: {
				name
			}
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log('[STORE_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: { params: { storeId: string } }) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const store = await prismadb.store.deleteMany({
			where: {
				id: params.storeId,
				userId
			}
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log('[STORE_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
	try {
		const store = await prismadb.store.findUnique({
			where: {
				id: params.storeId
			}
		});

		return NextResponse.json({ name: store?.name });
	} catch (error) {
		console.log('[STORE_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};
