import React from "react";

type ButtonProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>; // Type for onClick
    disabled?: boolean; // Optional: For disabled state
    className?: string; // Optional: For additional classes
    children?: React.ReactNode; // Optional: For button content
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
    const baseClasses = "p-2 m-2 border-2 border-gray-300 cursor-pointer rounded-xl";
    return (
        <button onClick={onClick} className={baseClasses + " " + className} type="button">
            {children}
        </button>
    );
};

export default Button;