import { FC } from 'react';

interface IconClipboardListProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconClipboardList: FC<IconClipboardListProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195" stroke="currentColor" strokeWidth="1.5" />
                    <path opacity={duotone ? '0.5' : '1'} d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M8 18H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path opacity={duotone ? '0.5' : '1'} d="M16 4C18.175 4.0121 19.3529 4.10856 20.1213 4.87694C21 5.75562 21 7.16983 21 9.99826V15.9983C21 18.8267 21 20.2409 20.1213 21.1196C19.2426 22 17.8284 22 15 22H9C6.17157 22 4.75736 22 3.87868 21.1196C3 20.2409 3 18.8267 3 15.9983V9.99826C3 7.16983 3 5.75562 3.87868 4.87694C4.64706 4.10856 5.82497 4.0121 8 4C8 5.10457 8.89543 6 10 6H14C15.1046 6 16 5.10457 16 4Z" fill="currentColor" />
                    <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="currentColor" />
                    <path d="M8 13C8 12.4477 8.44772 12 9 12H15C15.5523 12 16 12.4477 16 13C16 13.5523 15.5523 14 15 14H9C8.44772 14 8 13.5523 8 13Z" fill="currentColor" />
                    <path d="M8 17C8 16.4477 8.44772 16 9 16H12C12.5523 16 13 16.4477 13 17C13 17.5523 12.5523 18 12 18H9C8.44772 18 8 17.5523 8 17Z" fill="currentColor" />
                    <path d="M8 9C8 8.44772 8.44772 8 9 8H15C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10H9C8.44772 10 8 9.55228 8 9Z" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconClipboardList;