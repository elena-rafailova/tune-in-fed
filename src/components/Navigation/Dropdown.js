import React from 'react';
import { Link } from 'react-router-dom';
import './Dropdown.scss';

const Dropdown = ({
    items,
    closeDrawerHandler,
    className,
    setIsClicked,
    clicked,
}) => {
    return (
        <React.Fragment>
            <ul
                className={`${
                    !clicked ? 'dropdown-menu closed' : 'dropdown-menu'
                } ${className}`}
            >
                {items.map((item, index) => {
                    return (
                        <li key={index}>
                            {item.path ? (
                                <Link
                                    className={item.cName}
                                    to={item.path}
                                    onClick={() => {
                                        setIsClicked(false);
                                        if (closeDrawerHandler) {
                                            closeDrawerHandler();
                                        }
                                    }}
                                >
                                    {item.title}
                                </Link>
                            ) : (
                                <button
                                    className={item.cName}
                                    onClick={() => {
                                        setIsClicked(false);
                                        item.function();
                                        if (closeDrawerHandler) {
                                            closeDrawerHandler();
                                        }
                                    }}
                                >
                                    {item.title}
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </React.Fragment>
    );
};

export default Dropdown;
