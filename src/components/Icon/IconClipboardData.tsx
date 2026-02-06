import { FC } from 'react';

interface IconClipboardDataProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconClipboardData: FC<IconClipboardDataProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005" stroke="currentColor" strokeWidth="1.5" />
                    <path opacity={duotone ? '0.5' : '1'} d="M8 3C8 2.06812 8 1.60218 8.15224 1.23463C8.35523 0.74458 8.74458 0.35523 9.23463 0.15224C9.60218 0 10.0681 0 11 0H13C13.9319 0 14.3978 0 14.7654 0.15224C15.2554 0.35523 15.6448 0.74458 15.8478 1.23463C16 1.60218 16 2.06812 16 3C16 3.93188 16 4.39782 15.8478 4.76537C15.6448 5.25542 15.2554 5.64477 14.7654 5.84776C14.3978 6 13.9319 6 13 6H11C10.0681 6 9.60218 6 9.23463 5.84776C8.74458 5.64477 8.35523 5.25542 8.15224 4.76537C8 4.39782 8 3.93188 8 3Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 18H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path opacity={duotone ? '0.5' : '1'} d="M16 4C18.175 4.0121 19.3529 4.10856 20.1213 4.87694C21 5.75562 21 7.16983 21 9.99826V15.9983C21 18.8267 21 20.2409 20.1213 21.1196C19.2426 22 17.8284 22 15 22H9C6.17157 22 4.75736 22 3.87868 21.1196C3 20.2409 3 18.8267 3 15.9983V9.99826C3 7.16983 3 5.75562 3.87868 4.87694C4.64706 4.10856 5.82497 4.0121 8 4C8 5.10457 8.89543 6 10 6H14C15.1046 6 16 5.10457 16 4Z" fill="currentColor" />
                    <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="currentColor" />
                    <path d="M8 13C8 12.4477 8.44772 12 9 12H12C12.5523 12 13 12.4477 13 13C13 13.5523 12.5523 14 12 14H9C8.44772 14 8 13.5523 8 13Z" fill="currentColor" />
                    <path d="M8 9C8 8.44772 8.44772 8 9 8H15C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10H9C8.44772 10 8 9.55228 8 9Z" fill="currentColor" />
                    <path d="M8 17C8 16.4477 8.44772 16 9 16H13C13.5523 16 14 16.4477 14 17C14 17.5523 13.5523 18 13 18H9C8.44772 18 8 17.5523 8 17Z" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconClipboardData;