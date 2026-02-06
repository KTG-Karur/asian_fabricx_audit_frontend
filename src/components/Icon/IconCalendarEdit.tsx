import { FC } from 'react';

interface IconCalendarEditProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconCalendarEdit: FC<IconCalendarEditProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path opacity={duotone ? '0.5' : '1'} d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M14.5 17.5V17.51M11 14L12.2961 12.8276C12.6648 12.4938 13.2033 12.4938 13.572 12.8276L15.2471 14.3941C15.6158 14.728 15.6158 15.272 15.2471 15.6059L11 19.5H15.5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path opacity={duotone ? '0.5' : '1'} d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H12C11.4477 22 11 21.5523 11 21V17C11 15.8954 11.8954 15 13 15H16C16.5523 15 17 14.5523 17 14V12C17 11.4477 16.5523 11 16 11H8C7.44772 11 7 11.4477 7 12V14C7 14.5523 7.44772 15 8 15H11V21C11 21.5523 10.5523 22 10 22C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" fill="currentColor" />
                    <path d="M7 3V5M17 3V5M22 12H2M10 22V17C10 15.8954 10.8954 15 12 15C13.1046 15 14 15.8954 14 17V22M15.5 17.5V17.51M11 14L12.2961 12.8276C12.6648 12.4938 13.2033 12.4938 13.572 12.8276L15.2471 14.3941C15.6158 14.728 15.6158 15.272 15.2471 15.6059L11 19.5H15.5V15" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconCalendarEdit;