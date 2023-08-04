import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Select } from '@radix-ui/react-select';

interface Props {
	params: {
		storeId: string;
	};
}

export async function POST(req: Request, { params }: Props) {
	try {
		const { userId } = auth();
		const {
			name,
			price,
			description,
			images,
			categoryId,
			colorId,
			sizeId,
			isFeatured,
			isArchived,
			stock: stockObj
		} = await req.json();

		const isFeaturedBool = stockObj.stockQuantity === 0 ? false : isFeatured;

		const validationErrors = [
			{ condition: !userId, message: 'Unauthenticated', status: 401 },
			{ condition: !name, message: 'Name is required', status: 400 },
			{ condition: !price, message: 'Price is required', status: 400 },
			{
				condition: description.length > 2000,
				message: 'Description must contain at most 2000 character(s).',
				status: 400
			},
			{ condition: !images || !images.length, message: 'Images are required', status: 400 },
			{ condition: !categoryId, message: 'Category id is required', status: 400 },
			{ condition: !colorId, message: 'Color id is required', status: 400 },
			{ condition: !sizeId, message: 'Size id is required', status: 400 },
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
				isFeatured: isFeaturedBool,
				isArchived,
				storeId: params.storeId,
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)]
					}
				},
				stock: {
					createMany: {
						data: {
							storeId: params.storeId,
							quantity: stockObj.stockQuantity
						}
					}
				}
			},
			include: {
				stock: true
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: Props) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams?.get('categoryId') || undefined;
		const colorId = searchParams?.get('colorId') || undefined;
		const sizeId = searchParams?.get('sizeId') || undefined;
		const productName = searchParams?.get('productName') || undefined;
		const isFeatured = searchParams?.get('isFeatured');

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const maxResult = 20;

		if (productName) {
			console.log('🚀 ~ file: route.ts:126 ~ GET ~ productName:', productName);
			const products = await prismadb.product.findMany({
				where: {
					storeId: params.storeId,
					name: {
						contains: productName
					},
					isFeatured: isFeatured ? true : undefined,
					isArchived: false
				},
				orderBy: {
					createdAt: 'desc'
				},
				take: maxResult,
				select: {
					id: true,
					name: true,
					images: {
						select: {
							id: true,
							url: true
						},
						where: {
							url: {
								not: undefined
							}
						},
						take: 1
					}
				}
			});

			console.log(JSON.stringify(products));

			const headers: Record<string, string> = {
				...{
					vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch, RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding',
					'access-control-allow': 'true',
					'access-control-allow-origin': 'http://localhost:3001',
					'content-type': 'application/json',
					connection: 'close',
					'transfer-encoding': 'chunked',
					'access-control-allow-credentials': 'true',
					'access-control-allow-methods': '*'
				}
			};

			if (process.env.FRONTEND_STORE_URL && process.env.NODE_ENV === 'production') {
				headers['access-control-allow-origin'] = process.env.FRONTEND_STORE_URL;
			}
			console.log('🚀 ~ file: route.ts:162 ~ GET ~ headers:', headers);

			return NextResponse.json(products, { headers, status: 200 });
		} else {
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
					size: true,
					stock: true
				},
				orderBy: {
					createdAt: 'desc'
				}
			});

			return NextResponse.json(products, { status: 200 });
		}
	} catch (error) {
		console.log('[PRODUCTS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
