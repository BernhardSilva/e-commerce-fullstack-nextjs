import { TooltipProvider } from '@radix-ui/react-tooltip';
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface TooltipInfoProps {
	trigger: string;
	content: string;
}

const TooltipInfo = ({ trigger, content }: TooltipInfoProps) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{trigger}</TooltipTrigger>
				<TooltipContent>
					<p>{content}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipInfo;
