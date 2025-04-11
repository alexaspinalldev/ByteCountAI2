import React from "react";

type ButtonProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>; // Type for onClick
    disabled?: boolean; // Optional: For disabled state
    className?: string; // Optional: For additional classes
    children?: React.ReactNode; // Optional: For button content
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
    const baseClasses = "px-2 py-1 border-1 border-gray-400 cursor-pointer rounded-xl";
    return (
        <button onClick={onClick} className={baseClasses + " " + className} type="button">
            {children}
        </button>
    );
};

export default Button;