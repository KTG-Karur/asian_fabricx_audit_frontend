import { FC } from 'react';

interface IconUserCheckProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconUserCheck: FC<IconUserCheckProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path opacity={duotone ? '0.5' : '1'} d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M15 18L16.5 19.5L20 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <circle cx="12" cy="6" r="4" fill="currentColor" />
                    <path opacity={duotone ? '0.5' : '1'} d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" fill="currentColor" />
                    <path d="M15.0303 15.9697C15.3232 16.2626 15.3232 16.7374 15.0303 17.0303L14.0303 18.0303C13.7374 18.3232 13.2626 18.3232 12.9697 18.0303L11.9697 17.0303C11.6768 16.7374 11.6768 16.2626 11.9697 15.9697C12.2626 15.6768 12.7374 15.6768 13.0303 15.9697L13.5 16.4393L15.9697 13.9697C16.2626 13.6768 16.7374 13.6768 17.0303 13.9697C17.3232 14.2626 17.3232 14.7374 17.0303 15.0303L15.0303 17.0303V15.9697Z" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconUserCheck;