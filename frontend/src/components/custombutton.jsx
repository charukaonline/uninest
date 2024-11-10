import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

function Btn({
                 btnName,
                 btnType = 'button',
                 color,
                 hoverColor,
                 textColor,
                 hoverTextColor,
                 onClick,
                 onDoubleClick,
                 onFocus,
                 onBlur,
                 disabled = false,
                 loading = false,
                 icon,
                 shape = 'default',
                 size = 'default',
                 style = {},
                 className = '',
                 ariaLabel = ''
             }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleDoubleClick = () => {
        if (onDoubleClick) {
            onDoubleClick();
        }
    };

    const handleFocus = () => {
        if (onFocus) {
            onFocus();
        }
    };

    const handleBlur = () => {
        if (onBlur) {
            onBlur();
        }
    };

    return (
        <Button
            type={btnType}
            className={`p-5 text-base font-bold rounded-full shadow ${className}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            loading={loading}
            shape={shape}
            size={size}
            icon={icon}
            aria-label={ariaLabel}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                backgroundColor: isHovered ? hoverColor : color,
                color: isHovered ? hoverTextColor : textColor,
                borderColor: isHovered ? hoverColor : color,
                transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                ...style
            }}
        >
            {btnName}
        </Button>
    );
}

Btn.propTypes = {
    btnName: PropTypes.string.isRequired,
    btnType: PropTypes.string,
    color: PropTypes.string,
    hoverColor: PropTypes.string,
    textColor: PropTypes.string,
    hoverTextColor: PropTypes.string,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    icon: PropTypes.node,
    shape: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    ariaLabel: PropTypes.string
};

export default Btn;
