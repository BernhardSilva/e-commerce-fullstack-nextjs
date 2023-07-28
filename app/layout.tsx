import { Inter } from 'next/font/google';
import './globals.css';

import { ModalProvider } from '@/providers/modal-provider';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { ToasterProvider } from '@/providers/toast-provider';
import { ThemeProvider } from '@/providers/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Store admin dashboard',
	description: 'Store admin dashboard for manage created stores and get KPI etc.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>
					<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
						<ToasterProvider />
						<ModalProvider />
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
