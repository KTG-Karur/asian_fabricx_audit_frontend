import { FC } from 'react';

interface IconCalendarEventProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconCalendarEvent: FC<IconCalendarEventProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path opacity={duotone ? '0.5' : '1'} d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M15 17H9V15H15V17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 13H9V11H13V13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path opacity={duotone ? '0.5' : '1'} d="M7 4V2M17 4V2M2 9H22M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" fill="currentColor" />
                    <path d="M9 15C8.44772 15 8 15.4477 8 16C8 16.5523 8.44772 17 9 17H15C15.5523 17 16 16.5523 16 16C16 15.4477 15.5523 15 15 15H9Z" fill="currentColor" />
                    <path d="M9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H9Z" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconCalendarEvent;