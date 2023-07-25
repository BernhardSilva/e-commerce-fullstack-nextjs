import toast from 'react-hot-toast';

export const copyClipboard = (value: string, message: string) => {
	navigator.clipboard.writeText(value);
	toast.success(message);
};
