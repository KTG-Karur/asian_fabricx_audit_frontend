import { FC } from 'react';

interface IconCalendarClockProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconCalendarClock: FC<IconCalendarClockProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path opacity={duotone ? '0.5' : '1'} d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M14.5 18C14.5 16.3431 13.1569 15 11.5 15C9.84315 15 8.5 16.3431 8.5 18C8.5 19.6569 9.84315 21 11.5 21C13.1569 21 14.5 19.6569 14.5 18Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M11.5 17V18L12.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path opacity={duotone ? '0.5' : '1'} d="M7 4V2M17 4V2M2 9H22M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" fill="currentColor" />
                    <path d="M11.5 21C9.84315 21 8.5 19.6569 8.5 18C8.5 16.3431 9.84315 15 11.5 15C13.1569 15 14.5 16.3431 14.5 18C14.5 19.6569 13.1569 21 11.5 21Z" fill="currentColor" />
                    <path d="M11.5 17V18L12.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconCalendarClock;