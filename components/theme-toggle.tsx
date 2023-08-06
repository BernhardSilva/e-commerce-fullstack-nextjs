'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import CustomButton from '@/components/ui/custom-buttom';


interface ThemeToggleProps {
	className?: string;
	Icon?: any;
}

export const ThemeToggle = ({ className, Icon }: ThemeToggleProps) => {
	const { setTheme, theme } = useTheme();

	const handleClick = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<>
			{className ? (
				<div className={className}>
					{Icon ? (
						Icon
					) : (
						<div className='h-full w-full flex items-center justify-center'>
							<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
							<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
						</div>
					)}
				</div>
			) : (
				<CustomButton
					onClick={handleClick}
					className='rounded-full h-[36px] w-[36px] p-0 border-2 border-gray-200
							dark:border-white hover:border-2 dark:hover:border-green-500'
				>
					<div className='relative h-full w-full flex items-center justify-center'>
						<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
						<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
						<span className='sr-only'>Toggle theme</span>
					</div>
				</CustomButton>
			)}
		</>
	);
};
