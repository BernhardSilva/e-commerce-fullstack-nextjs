'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import { CellAction } from './cell-action';
import { HoverCard, HoverCardContent } from '@/components/ui/hover-card';
import { HoverCardTrigger } from '@radix-ui/react-hover-card';
import HoverCardInfo from '@/components/ui/hover-card-info';

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
		header: 'Address',
		cell: ({ row }) => (
			<HoverCardInfo
				trigger={row.original.address.length > 30 ? `${row.original.address.slice(0, 30)}...` : row.original.address}
				value={row.original.address}
			/>
		)
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
		header: 'Products',
		cell: ({ row }) => (
			<HoverCardInfo
				trigger={row.original.products.length > 30 ? `${row.original.products.slice(0, 30)}...` : row.original.products}
				value={row.original.products}
			/>
		)
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
