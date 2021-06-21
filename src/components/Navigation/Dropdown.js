import React, { useState } from 'react';
import './Dropdown.scss';
import { Link } from 'react-router-dom';

function Dropdown({ items, closeDrawerHandler, className }) {
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    return (
        <React.Fragment>
            <ul
                onClick={handleClick}
                className={`${
                    click ? 'dropdown-menu clicked' : 'dropdown-menu'
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
                                        setClick(false);
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
                                        setClick(false);
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
}

export default Dropdown;
