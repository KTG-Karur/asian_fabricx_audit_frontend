import { FC } from 'react';

interface IconLayoutDashboardProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconLayoutDashboard: FC<IconLayoutDashboardProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path opacity={duotone ? '0.5' : '1'} d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M9 12C9 11.0572 9 10.5858 9.29289 10.2929C9.58579 10 10.0572 10 11 10H13C13.9428 10 14.4142 10 14.7071 10.2929C15 10.5858 15 11.0572 15 12V16C15 16.9428 15 17.4142 14.7071 17.7071C14.4142 18 13.9428 18 13 18H11C10.0572 18 9.58579 18 9.29289 17.7071C9 17.4142 9 16.9428 9 16V12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 12H9V18H2V12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M15 12H22V18H15V12Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path opacity={duotone ? '0.5' : '1'} d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" fill="currentColor" />
                    <path d="M2 12C2 11.0572 2 10.5858 2.29289 10.2929C2.58579 10 3.05719 10 4 10H8C8.94281 10 9.41421 10 9.70711 10.2929C10 10.5858 10 11.0572 10 12V20C10 20.9428 10 21.4142 9.70711 21.7071C9.41421 22 8.94281 22 8 22H4C3.05719 22 2.58579 22 2.29289 21.7071C2 21.4142 2 20.9428 2 20V12Z" fill="currentColor" />
                    <path d="M14 12C14 11.0572 14 10.5858 14.2929 10.2929C14.5858 10 15.0572 10 16 10H20C20.9428 10 21.4142 10 21.7071 10.2929C22 10.5858 22 11.0572 22 12V20C22 20.9428 22 21.4142 21.7071 21.7071C21.4142 22 20.9428 22 20 22H16C15.0572 22 14.5858 22 14.2929 21.7071C14 21.4142 14 20.9428 14 20V12Z" fill="currentColor" />
                    <path d="M9 4C9 3.05719 9 2.58579 9.29289 2.29289C9.58579 2 10.0572 2 11 2H13C13.9428 2 14.4142 2 14.7071 2.29289C15 2.58579 15 3.05719 15 4V8C15 8.94281 15 9.41421 14.7071 9.70711C14.4142 10 13.9428 10 13 10H11C10.0572 10 9.58579 10 9.29289 9.70711C9 9.41421 9 8.94281 9 8V4Z" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconLayoutDashboard;