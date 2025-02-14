/*
 * This file is auto-generated. Do not modify it manually!
 * Run 'yarn workspace @proton/icons build' to update the icons react components.
 */
import React from 'react';

import type { IconSize } from '../types';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    /** If specified, renders an sr-only element for screenreaders */
    alt?: string;
    /** If specified, renders an inline title element */
    title?: string;
    /**
     * The size of the icon
     * Refer to the sizing taxonomy: https://design-system.protontech.ch/?path=/docs/components-icon--basic#sizing
     */
    size?: IconSize;
}

export const IcNotepadChecklist = ({
    alt,
    title,
    size = 4,
    className = '',
    viewBox = '0 0 16 16',
    ...rest
}: IconProps) => {
    return (
        <>
            <svg
                viewBox={viewBox}
                className={`icon-size-${size} ${className}`}
                role="img"
                focusable="false"
                aria-hidden="true"
                {...rest}
            >
                {title ? <title>{title}</title> : null}

                <path
                    fillRule="evenodd"
                    d="M7 1a1 1 0 0 1 2 0h1a1 1 0 0 1 1 1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1.01a1 1 0 0 1 1-1H7Zm-.99 1v1H10V2H6.01ZM12 3h-1a1 1 0 0 1-1 1H6.01a1 1 0 0 1-1-1H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1ZM6.5 5.793a.5.5 0 0 1 .707.707L5.854 7.854a.5.5 0 0 1-.708 0L4.5 7.207a.5.5 0 0 1 .707-.707l.293.293 1-1ZM8 7a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H8Zm-.5 2.5A.5.5 0 0 1 8 9h3a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5Zm0 2A.5.5 0 0 1 8 11h3a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5ZM5.5 9a.5.5 0 0 0 0 1h.01a.5.5 0 0 0 0-1H5.5ZM5 11.5a.5.5 0 0 1 .5-.5h.01a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5Z"
                ></path>
            </svg>
            {alt ? <span className="sr-only">{alt}</span> : null}
        </>
    );
};
