'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ArrowDown, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

import useRoutes from '@/hooks/use-routes';
import { ThemeToggle } from '../theme-toggle';
import { useRouter } from 'next/navigation';

const MobileNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
	const { setTheme, theme } = useTheme();
	const routes = useRoutes();

	const router = useRouter();

	const handleClick = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	const handleClickRoute = (href: string) => {
		router.push(href);
	};
	return (
		<div className='inline-flex gap-4 sm:ml-5'>
			<div className='flex justify-center'>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Menu size={35} className='cursor-pointer hover' />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={handleClick} className='cursor-pointer'>
							<ThemeToggle className='flex justify-center' />
							<span className='ml-2'>{theme === 'dark' ? 'Dark' : 'Light'}</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuLabel className='inline-flex'>
							<ArrowDown size={15} className='mr-1 mt-0.5' /> Links
						</DropdownMenuLabel>
						<DropdownMenuSeparator />

						{routes.map((route) => (
							<DropdownMenuItem key={route.href} onClick={() => handleClickRoute(route.href)}>
								{route.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default MobileNav;
