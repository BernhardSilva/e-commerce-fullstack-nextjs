import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
	try {
		const { userId } = auth();
		const { name, price, description, images, categoryId, colorId, sizeId, isFeatured, isArchived } = await req.json();

		const validationErrors = [
			{ condition: !userId, message: 'Unauthenticated', status: 401 },
			{ condition: !name, message: 'Name is required', status: 400 },
			{ condition: !price, message: 'Price is required', status: 400 },
			{ condition: !description, message: 'Description is required', status: 400 },
			{ condition: !images || !images.length, message: 'Images are required', status: 400 },
			{ condition: !categoryId, message: 'Category id is required', status: 400 },
			{ condition: !colorId, message: 'Color id is required', status: 400 },
			{ condition: !sizeId, message: 'Size id is required', status: 400 },
			{ condition: !isFeatured, message: 'Featured is required', status: 400 },
			{ condition: !isArchived, message: 'Archived is required', status: 400 },
			{ condition: !params.storeId, message: 'Store id is required', status: 400 }
		];

		const error = validationErrors.find((error) => error.condition);

		if (error) {
			return new NextResponse(error.message, { status: error.status });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId: userId ?? undefined
			}
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthoriazed', { status: 403 });
		}

		const productFound = await prismadb.product.findFirst({
			where: {
				name
			}
		});

		if (productFound) {
			return new NextResponse('Product is registered, choose different name', { status: 400 });
		}

		const product = await prismadb.product.create({
			data: {
				name,
				price,
				description,
				categoryId,
				colorId,
				sizeId,
				isFeatured,
				isArchived,
				storeId: params.storeId,
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)]
					}
				}
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get('categoryId') || undefined;
		const colorId = searchParams.get('categoryId') || undefined;
		const sizeId = searchParams.get('categoryId') || undefined;
		const isFeatured = searchParams.get('isFeatured');

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
				colorId,
				sizeId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false
			},
			include: {
				images: true,
				category: true,
				color: true,
				size: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		return NextResponse.json(products);
	} catch (error) {
		console.log('[PRODUCTS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}