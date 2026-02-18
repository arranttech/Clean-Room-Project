import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaInfoCircle } from 'react-icons/fa';
import TooltipDesign from './TooltipDesign';
import 'react-tooltip/dist/react-tooltip.css';
import React from 'react';

interface TooltipProps {
    id: string;
    children?: React.ReactNode;
    content: React.ReactNode;
}


export function Tooltip({
    id,
    children,
    content
}: TooltipProps) {
    return (
        <>
            <span
                data-tooltip-id={id}
                className={TooltipDesign.triggerWrapper}
            >
                {children || <FaInfoCircle className={TooltipDesign.icon} />}
            </span>

            <ReactTooltip
                id={id}
                place="right"
                className={TooltipDesign.container}
                classNameArrow={TooltipDesign.arrow}
                opacity={1}
            >
                {content}
            </ReactTooltip>
        </>
    );
}