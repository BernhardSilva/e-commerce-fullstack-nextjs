import { UserButton, auth } from '@clerk/nextjs';
import { redirect, useParams, usePathname } from 'next/navigation';

import prismadb from '@/lib/prismadb';
import MobileNav from './mobile-nav';
import StoreSwitcher from '../store-switcher';
import { ThemeToggle } from '../theme-toggle';
import { DesktopNav } from './desktop-nav';

const Navbar = async () => {
	const { userId } = auth();

	if (!userId) {
		redirect('/sign-in');
	}
	const stores = await prismadb.store.findMany({
		where: {
			userId
		}
	});

	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4 sm:px-8'>
				<StoreSwitcher items={stores} className='ml-2 sm:ml-0' />
				<DesktopNav className='hidden lg:block mx-6' />
				<div className='ml-auto flex items-center space-x-4'>
					<div className='block lg:hidden mt-1'>
						<MobileNav />
					</div>
					<span className='hidden lg:block'>
						<ThemeToggle />
					</span>
					<div className='border-2 border-white hover:border-green-500 rounded-full'>
						<UserButton afterSignOutUrl='/' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
