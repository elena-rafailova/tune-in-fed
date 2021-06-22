import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import { CategoriesContext } from '../../context/categories-context';
import Dropdown from './Dropdown';
import { ReactComponent as IconArrow } from '../../assets/icons/up-arrow.svg';
import './NavLinks.scss';

const NavLinks = ({ closeDrawerHandler }) => {
    const auth = useContext(AuthContext);
    const categoriesContext = useContext(CategoriesContext);

    const [dropdown, setDropdown] = useState({});

    const profileOptions = [
        {
            title: 'Settings',
            path: '/profile/settings',
            cName: 'dropdown-link',
        },
        {
            title: 'Payment',
            path: '/profile/payment',
            cName: 'dropdown-link',
        },
        {
            title: 'Lists',
            path: '/profile/lists',
            cName: 'dropdown-link',
        },
        {
            title: 'Logout',
            function: auth.logout,
            cName: 'dropdown-link',
        },
    ];

    const toggleDropdown = (clickedTabName) => {
        if (dropdown.tabName === clickedTabName) {
            setDropdown({
                tabName: clickedTabName,
                isOpen: !dropdown.isOpen,
            });
        } else {
            setDropdown({
                tabName: clickedTabName,
                isOpen: true,
            });
        }
    };

    const isDropdownActive = (tabName) => {
        return dropdown.tabName === tabName && dropdown.isOpen;
    };

    return (
        <ul className="nav-links">
            <li
                className="nav-item-wrapper"
                onClick={closeDrawerHandler ? closeDrawerHandler : null}
            >
                <NavLink to="/library/recommended" exact className="nav-item">
                    Recommended
                </NavLink>
            </li>
            <li
                className="nav-item-wrapper"
                onClick={closeDrawerHandler ? closeDrawerHandler : null}
            >
                <NavLink to="/search" exact className="nav-item">
                    Search
                </NavLink>
            </li>
            <li
                className="nav-item-wrapper"
                onClick={() => toggleDropdown('categories')}
            >
                <div
                    className={`nav-item ${
                        isDropdownActive('categories') ? 'active' : ''
                    }`}
                >
                    Categories
                    <IconArrow />
                </div>
                {isDropdownActive('categories') &&
                    categoriesContext.categories && (
                        <Dropdown
                            items={categoriesContext.categories}
                            closeDrawerHandler={closeDrawerHandler}
                            className="categories"
                        />
                    )}
            </li>
            <li
                className="nav-item-wrapper"
                onClick={closeDrawerHandler ? closeDrawerHandler : null}
            >
                <NavLink to="/help" exact className="nav-item">
                    Help
                </NavLink>
            </li>
            {auth.isLoggedIn && (
                <li
                    className="nav-item-wrapper"
                    onClick={() => toggleDropdown('profile')}
                >
                    <div
                        className={`nav-item ${
                            isDropdownActive('profile') ? 'active' : ''
                        }`}
                    >
                        Profile
                        <IconArrow />
                    </div>
                    {isDropdownActive('profile') && (
                        <Dropdown
                            items={profileOptions}
                            closeDrawerHandler={closeDrawerHandler}
                        />
                    )}
                </li>
            )}
            {!auth.isLoggedIn && (
                <li
                    className="nav-item-wrapper"
                    onClick={closeDrawerHandler ? closeDrawerHandler : null}
                >
                    <NavLink to="/auth" className="nav-item">
                        Auth
                    </NavLink>
                </li>
            )}
        </ul>
    );
};

export default NavLinks;
