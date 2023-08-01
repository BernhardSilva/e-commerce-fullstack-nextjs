'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import { CellAction } from './cell-action';

export type OrderColumn = {
	id: string;
	customer: string;
	email: string;
	phone: string;
	address: string;
	isPaid: boolean;
	isRefunded: boolean;
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
		accessorKey: 'customer',
		header: 'Customer'
	},
	{
		accessorKey: 'email',
		header: 'Email'
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
		header: 'Paid',
		cell: (props) => (props.getValue() ? <Check color='green' /> : <X color='gray' />)
	},
	{
		accessorKey: 'isRefunded',
		header: 'Refunded',
		cell: (props) => (props.getValue() ? <Check color='green'></Check> : <X color='gray' />)
	},
	{
		accessorKey: 'createdAt',
		header: 'Date'
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />
	}
];
