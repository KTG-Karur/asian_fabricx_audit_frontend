import { FC } from 'react';

interface IconTruckProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconTruck: FC<IconTruckProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M5 2V11.5C5 13.1569 6.34315 14.5 8 14.5C9.65685 14.5 11 13.1569 11 11.5V7M5 2H15M5 2H4C2.89543 2 2 2.89543 2 4V18C2 19.1046 2.89543 20 4 20H5M15 2H20C21.1046 2 22 2.89543 22 4V10C22 10.5523 21.5523 11 21 11H19C17.8954 11 17 11.8954 17 13V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 18C9.10457 18 10 17.1046 10 16C10 14.8954 9.10457 14 8 14C6.89543 14 6 14.8954 6 16C6 17.1046 6.89543 18 8 18Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 18C17.1046 18 18 17.1046 18 16C18 14.8954 17.1046 14 16 14C14.8954 14 14 14.8954 14 16C14 17.1046 14.8954 18 16 18Z" stroke="currentColor" strokeWidth="1.5" />
                    <path opacity={duotone ? '0.5' : '1'} d="M5 20H8M11 20H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M19 11H17C15.8954 11 15 11.8954 15 13V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path opacity={duotone ? '0.5' : '1'} d="M2 5C2 3.34315 3.34315 2 5 2H15V10C15 10.5523 15.4477 11 16 11H21V18C21 19.1046 20.1046 20 19 20H15C15 18.8954 14.1046 18 13 18C11.8954 18 11 18.8954 11 20H5C3.89543 20 3 19.1046 3 18V5Z" fill="currentColor" />
                    <path d="M21 11V13C21 13.5523 20.5523 14 20 14H19C17.8954 14 17 13.1046 17 12V11H21Z" fill="currentColor" />
                    <path d="M8 18C9.10457 18 10 17.1046 10 16C10 14.8954 9.10457 14 8 14C6.89543 14 6 14.8954 6 16C6 17.1046 6.89543 18 8 18Z" fill="currentColor" />
                    <path d="M16 18C17.1046 18 18 17.1046 18 16C18 14.8954 17.1046 14 16 14C14.8954 14 14 14.8954 14 16C14 17.1046 14.8954 18 16 18Z" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconTruck;