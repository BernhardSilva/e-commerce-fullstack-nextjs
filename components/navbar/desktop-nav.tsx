'use client';

import useRoutes from '@/hooks/use-routes';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const DesktopNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
	const routes = useRoutes();

	return (
		<nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'text-sm font-medium transition-colors hover:text-primary',
						route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
};
