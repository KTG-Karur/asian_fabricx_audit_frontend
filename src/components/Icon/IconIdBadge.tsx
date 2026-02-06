import { FC } from 'react';

interface IconIdBadgeProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconIdBadge: FC<IconIdBadgeProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <path opacity={duotone ? '0.5' : '1'} d="M4 18C4 15.1716 4 13.7574 4.87868 12.8787C5.75736 12 7.17157 12 10 12H14C16.8284 12 18.2426 12 19.1213 12.8787C20 13.7574 20 15.1716 20 18C20 19.8856 20 20.8284 19.4142 21.4142C18.8284 22 17.8856 22 16 22H8C6.11438 22 5.17157 22 4.58579 21.4142C4 20.8284 4 19.8856 4 18Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <circle cx="12" cy="8" r="3" fill="currentColor" />
                    <path opacity={duotone ? '0.5' : '1'} d="M4 18C4 15.1716 4 13.7574 4.87868 12.8787C5.75736 12 7.17157 12 10 12H14C16.8284 12 18.2426 12 19.1213 12.8787C20 13.7574 20 15.1716 20 18C20 19.8856 20 20.8284 19.4142 21.4142C18.8284 22 17.8856 22 16 22H8C6.11438 22 5.17157 22 4.58579 21.4142C4 20.8284 4 19.8856 4 18Z" fill="currentColor" />
                    <path d="M15 16C15 15.4477 14.5523 15 14 15H10C9.44772 15 9 15.4477 9 16C9 16.5523 9.44772 17 10 17H14C14.5523 17 15 16.5523 15 16Z" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconIdBadge;