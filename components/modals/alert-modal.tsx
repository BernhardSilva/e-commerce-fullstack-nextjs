'use client';

import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
	title?: string;
	message?: string;
}

export const AlertModal = ({ isOpen, onClose, onConfirm, loading, title, message }: AlertModalProps) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<Modal
				title={`${!title ? 'Are you sure?.' : title}`}
				description={`${!message ? 'This action cannot be undone.' : message}`}
				isOpen={isOpen}
				onClose={onClose}
			>
				<div className='pt-6 space-x-2 flex items-center justify-end w-full'>
					<Button disabled={loading} variant='outline' onClick={onClose}>
						Cancel
					</Button>
					<Button disabled={loading} variant='destructive' onClick={onConfirm}>
						Continue
					</Button>
				</div>
			</Modal>
		</>
	);
};
