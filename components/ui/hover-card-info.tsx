import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface HoverCardInfoProps {
	trigger: string;
	content: string;
}

const HoverCardInfo = ({ trigger, content }: HoverCardInfoProps) => {
	return (
		<HoverCard>
			<HoverCardTrigger>{trigger}</HoverCardTrigger>
			<HoverCardContent>{content}</HoverCardContent>
		</HoverCard>
	);
};

export default HoverCardInfo;
