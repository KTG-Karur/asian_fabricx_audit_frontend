import { FC } from 'react';

interface IconBuildingWarehouseProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconBuildingWarehouse: FC<IconBuildingWarehouseProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M22 22L2 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M17 22V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 22V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7 22V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M20 22V8.5M4 22V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M21.5 9L13.2832 4.11628C12.6204 3.69846 11.812 3.69846 11.1492 4.11628L2.93239 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity={duotone ? '0.5' : '1'} d="M3 9L12 3L21 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M22 22H2V9C2 8.44772 2.44772 8 3 8H21C21.5523 8 22 8.44772 22 9V22Z" fill="currentColor" />
                    <path opacity={duotone ? '0.5' : '1'} d="M12.1492 4.11628C11.812 3.69846 11.188 3.69846 10.8508 4.11628L2.634 9C2.28384 9.428 2.28384 10.072 2.634 10.5L10.8508 15.3837C11.188 15.8015 11.812 15.8015 12.1492 15.3837L20.366 10.5C20.7162 10.072 20.7162 9.428 20.366 9L12.1492 4.11628Z" fill="currentColor" />
                    <path d="M7 13H5V22H7V13Z" fill="currentColor" />
                    <path d="M12 18H10V22H12V18Z" fill="currentColor" />
                    <path d="M17 13H15V22H17V13Z" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconBuildingWarehouse;