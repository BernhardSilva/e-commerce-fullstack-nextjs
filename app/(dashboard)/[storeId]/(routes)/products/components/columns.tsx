'use client';

import HoverCardInfo from '@/components/ui/hover-card-info';
import { ColumnDef } from '@tanstack/react-table';
import { Check, FolderCheck, FolderOpen, X } from 'lucide-react';
import { CellAction } from './cell-action';

export type ProductColumn = {
	id: string;
	name: string;
	price: string;
	category: string;
	color: string;
	size: string;
	stock: string;
	isFeatured: boolean;
	isArchived: boolean;
	createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<HoverCardInfo
				trigger={row.original.name.length > 30 ? `${row.original.name.slice(0, 30)}...` : row.original.name}
				content={row.original.name}
			/>
		)
	},
	{
		accessorKey: 'price',
		header: 'Price'
	},
	{
		accessorKey: 'category',
		header: 'Category'
	},
	{
		accessorKey: 'color',
		header: 'Color',
		cell: ({ row }) => (
			<div className='flex items-center gap-x-2'>
				{row.original.color}
				<div className='h-6 w-6 rounded-full border' style={{ backgroundColor: row.original.color }} />
			</div>
		)
	},
	{
		accessorKey: 'size',
		header: 'Size'
	},
	{
		accessorKey: 'stock',
		header: 'Stock'
	},
	{
		accessorKey: 'isFeatured',
		header: 'Featured',
		cell: ({ row }) => (
			<div className='flex items-center gap-x-2'>
				{row.original.isFeatured === true ? <Check color='green' /> : <X color='red' />}
			</div>
		)
	},
	{
		accessorKey: 'isArchived',
		header: 'Archived',
		cell: ({ row }) => (
			<div className='flex items-center gap-x-2'>
				{row.original.isArchived === true ? <FolderCheck color='orange' /> : <FolderOpen color='gray' />}
			</div>
		)
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
