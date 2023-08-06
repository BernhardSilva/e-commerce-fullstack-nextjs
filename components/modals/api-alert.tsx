'use client';

import { Copy, Server } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { copyClipboard } from '@/hooks/use-copy';
import { Textarea } from '../ui/textarea';

interface ApiAlertProps {
	title: string;
	description: string;
	variant: 'public' | 'admin';
}

const textMap: Record<ApiAlertProps['variant'], string> = {
	public: 'Public',
	admin: 'Admin'
};
const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
	public: 'secondary',
	admin: 'destructive'
};

export const ApiALert = ({ title, description, variant = 'public' }: ApiAlertProps) => {
	const onCopy = () => {
		copyClipboard(description, 'API Route copied to the clipboard.');
	};

	return (
		<Alert className='h-max-[210px] sm:h-auto'>
			<Server className='h-4 w-4' />
			<AlertTitle className='flex items-center gap-x-2'>
				{title}
				<Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>

				<Button variant='outline' size='icon' onClick={onCopy} className='absolute right-5 block sm:hidden h-[30px]'>
					<Copy className='h-4 w-4 ml-2.5' />
				</Button>
			</AlertTitle>

			<AlertDescription className='mt-4 flex items-center justify-between'>
				<code className='rounded bg-muted px-0 sm:px-[0.3rem] py-[0.2rem] front-mono text-sm font-semibold max-w-[87%] sm:block hidden'>
					{description}
				</code>
				<Button variant='outline' size='icon' onClick={onCopy} className='sm:block hidden'>
					<Copy className='h-4 w-4 ml-2.5' />
				</Button>
			</AlertDescription>
			<Textarea className='h-9 mt-2 sm:hidden block' disabled defaultValue={description} />
		</Alert>
	);
};
