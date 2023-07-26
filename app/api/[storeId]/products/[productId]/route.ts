import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const GET = async (req: Request, { params }: { params: { productId: string } }) => {
	try {
		if (!params.productId) {
			return new NextResponse('Product id required', { status: 400 });
		}

		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId
			},
			include: {
				images: true,
				category: true,
				color: true,
				size: true
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};

export const PATCH = async (req: Request, { params }: { params: { storeId: string; productId: string } }) => {
	try {
		const { userId } = auth();

		const { name, price, description, images, categoryId, colorId, sizeId, isFeatured, isArchived } = await req.json();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		const validationErrors = [
			{ condition: !userId, message: 'Unauthenticated', status: 401 },
			{ condition: !name, message: 'Name is required', status: 400 },
			{ condition: !description, message: 'Description is required', status: 400 },
			{ condition: !price, message: 'Price is required', status: 400 },
			{ condition: !images || !images.length, message: 'Images are required', status: 400 },
			{ condition: !categoryId, message: 'Category id is required', status: 400 },
			{ condition: !colorId, message: 'Color id is required', status: 400 },
			{ condition: !sizeId, message: 'Size id is required', status: 400 },
			{ condition: !params.productId, message: 'Product id is required', status: 400 },
			{ condition: !params.storeId, message: 'Store id is required', status: 400 }
		];

		const error = validationErrors.find((error) => error.condition);

		if (error) {
			return new NextResponse(error.message, { status: error.status });
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

		const productFound = await prismadb.product.findFirst({
			where: {
				name
			}
		});

		if (productFound && productFound.id !== params.productId) {
			return new NextResponse('Product is used, choose different name', { status: 400 });
		}

		await prismadb.product.update({
			where: {
				id: params.productId
			},
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
					deleteMany: {}
				}
			}
		});

		const product = await prismadb.product.update({
			where: {
				id: params.productId
			},
			data: {
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)]
					}
				}
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_PATCH]', error);

		return new NextResponse('Internal error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: { params: { storeId: string; productId: string } }) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.productId) {
			return new NextResponse('Product id required', { status: 400 });
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

		const product = await prismadb.product.deleteMany({
			where: {
				id: params.productId
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};
