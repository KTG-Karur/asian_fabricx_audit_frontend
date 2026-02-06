import { FC } from 'react';

interface IconClipboardCheckProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconClipboardCheck: FC<IconClipboardCheckProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M16 4C18.175 4.0121 19.3529 4.10856 20.1213 4.87694C21 5.75562 21 7.16983 21 9.99826V15.9983C21 18.8267 21 20.2409 20.1213 21.1196C19.2426 22 17.8284 22 15 22H9C6.17157 22 4.75736 22 3.87868 21.1196C3 20.2409 3 18.8267 3 15.9983V9.99826C3 7.16983 3 5.75562 3.87868 4.87694C4.64706 4.10856 5.82497 4.0121 8 4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 14L11 17L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path opacity={duotone ? '0.5' : '1'} d="M16 4C18.175 4.0121 19.3529 4.10856 20.1213 4.87694C21 5.75562 21 7.16983 21 9.99826V15.9983C21 18.8267 21 20.2409 20.1213 21.1196C19.2426 22 17.8284 22 15 22H9C6.17157 22 4.75736 22 3.87868 21.1196C3 20.2409 3 18.8267 3 15.9983V9.99826C3 7.16983 3 5.75562 3.87868 4.87694C4.64706 4.10856 5.82497 4.0121 8 4C8 5.10457 8.89543 6 10 6H14C15.1046 6 16 5.10457 16 4Z" fill="currentColor" />
                    <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="currentColor" />
                    <path d="M8 13C8 12.4477 8.44772 12 9 12H15C15.5523 12 16 12.4477 16 13C16 13.5523 15.5523 14 15 14H9C8.44772 14 8 13.5523 8 13Z" fill="currentColor" />
                    <path d="M8 17C8 16.4477 8.44772 16 9 16H12C12.5523 16 13 16.4477 13 17C13 17.5523 12.5523 18 12 18H9C8.44772 18 8 17.5523 8 17Z" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconClipboardCheck;