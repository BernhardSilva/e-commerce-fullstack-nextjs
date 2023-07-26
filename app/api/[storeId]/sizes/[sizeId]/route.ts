import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const GET = async (req: Request, { params }: { params: { sizeId: string } }) => {
	try {
		if (!params.sizeId) {
			return new NextResponse('Size id is required', { status: 400 });
		}

		const size = await prismadb.size.findUnique({
			where: {
				id: params.sizeId
			}
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log('[SIZE_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};

export const PATCH = async (req: Request, { params }: { params: { storeId: string; sizeId: string } }) => {
	try {
		const { userId } = auth();

		const { name, value } = await req.json();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		if (!value) {
			return new NextResponse('Value id is required', { status: 400 });
		}

		const sizeFound = await prismadb.size.findFirst({
			where: {
				name
			}
		});

		if (sizeFound && sizeFound.id !== params.sizeId) {
			return new NextResponse('Size is used, choose different name', { status: 400 });
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

		const size = await prismadb.size.updateMany({
			where: {
				id: params.sizeId
			},
			data: {
				name,
				value
			}
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log('[SIZE_PATCH]', error);

		return new NextResponse('Internal error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: { params: { storeId: string; sizeId: string } }) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.sizeId) {
			return new NextResponse('Size id is required', { status: 400 });
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

		const size = await prismadb.size.deleteMany({
			where: {
				id: params.sizeId
			}
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log('[SIZE_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};
