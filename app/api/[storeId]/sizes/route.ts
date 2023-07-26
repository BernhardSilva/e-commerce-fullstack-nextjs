import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
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

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const sizeFound = await prismadb.size.findFirst({
			where: {
				name
			}
		});

		if (sizeFound) {
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

		const size = await prismadb.size.create({
			data: {
				name,
				value,
				storeId: params.storeId
			}
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log('[SIZE_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
	try {
		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const categories = await prismadb.size.findMany({
			where: {
				storeId: params.storeId
			}
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.log('[SIZE_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
