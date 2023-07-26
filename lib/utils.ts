import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

export const isImage = (file: File): boolean => {
	const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
	return allowedFormats.includes(file.type);
};
