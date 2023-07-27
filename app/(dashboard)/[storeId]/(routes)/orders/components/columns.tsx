'use client';

import { ColumnDef } from '@tanstack/react-table';

export type OrderColumn = {
	id: string;
	phone: string;
	address: string;
	isPaid: boolean;
	products: string;
	totalPrice: string;
	createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
	{
		accessorKey: 'phone',
		header: 'Phone'
	},
	{
		accessorKey: 'address',
		header: 'Address'
	},
	{
		accessorKey: 'products',
		header: 'Products'
	},
	{
		accessorKey: 'totalPrice',
		header: 'Total'
	},
	{
		accessorKey: 'isPaid',
		header: 'Paid'
	},
	{
		accessorKey: 'createdAt',
		header: 'Date'
	}
];
