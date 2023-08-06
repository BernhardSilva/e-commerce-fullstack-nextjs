import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

interface HoverCardInfoProps {
	value: string;
	trigger: any;
}

const HoverCardInfo = ({ value, trigger }: HoverCardInfoProps) => {
	return (
		<HoverCard>
			<HoverCardTrigger>{trigger}</HoverCardTrigger>
			<HoverCardContent>{value}</HoverCardContent>
		</HoverCard>
	);
};

export default HoverCardInfo;
