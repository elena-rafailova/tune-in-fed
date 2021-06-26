import React, { useContext, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import { CategoriesContext } from '../../context/categories-context';
import Dropdown from './Dropdown';
import useClickOutside from '../../hooks/click-outside-hook';
import { ReactComponent as ArrowIcon } from '../../assets/icons/up-arrow.svg';
import './NavLinks.scss';

const NavLinks = ({ closeDrawerHandler }) => {
    const auth = useContext(AuthContext);
    const categoriesContext = useContext(CategoriesContext);

    const [dropdownsState, setDropdownsState] = useState({
        profile: false,
        categories: false,
    });

    const profileOptions = [
        {
            title: 'My Library',
            path: '/profile/lists',
            cName: 'dropdown-link',
        },
        {
            title: 'Billing & Subscription',
            path: '/profile/payment',
            cName: 'dropdown-link',
        },
        {
            title: 'Settings',
            path: '/profile/settings',
            cName: 'dropdown-link',
        },
        {
            title: 'Logout',
            function: auth.logout,
            cName: 'dropdown-link',
        },
    ];

    const dropdownCategoriesRef = useClickOutside(
        useCallback(() => {
            if (dropdownsState.categories) {
                setDropdownsState({
                    ...dropdownsState,
                    categories: false,
                });
            }
        }, [dropdownsState.categories])
    );

    const dropdownProfileRef = useClickOutside(
        useCallback(() => {
            if (dropdownsState.profile) {
                setDropdownsState({
                    ...dropdownsState,
                    profile: false,
                });
            }
        }, [dropdownsState.profile])
    );

    const toggleDropdown = (clickedTabName, value) => {
        if (value) {
            Object.keys(dropdownsState).forEach(
                (key) => (dropdownsState[key] = false)
            );
        }
        setDropdownsState({
            ...dropdownsState,
            [clickedTabName]: value,
        });
    };

    const isDropdownActive = (tabName) => {
        return dropdownsState[tabName];
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
                onClick={() =>
                    toggleDropdown('categories', !dropdownsState.categories)
                }
                ref={dropdownCategoriesRef}
            >
                <div
                    className={`nav-item ${
                        isDropdownActive('categories') ? 'active' : ''
                    }`}
                >
                    Categories
                    <ArrowIcon />
                </div>
                <Dropdown
                    items={categoriesContext.categories}
                    closeDrawerHandler={closeDrawerHandler}
                    className="categories-dropdown"
                    setIsClicked={(value) =>
                        toggleDropdown('categories', value)
                    }
                    clicked={isDropdownActive('categories')}
                />
            </li>
            {auth.isLoggedIn && (
                <li
                    className="nav-item-wrapper"
                    onClick={() =>
                        toggleDropdown('profile', !dropdownsState.profile)
                    }
                    ref={dropdownProfileRef}
                >
                    <div
                        className={`nav-item ${
                            isDropdownActive('profile') ? 'active' : ''
                        }`}
                    >
                        Profile
                        <ArrowIcon />
                    </div>
                    <Dropdown
                        items={profileOptions}
                        closeDrawerHandler={closeDrawerHandler}
                        className="profile-dropdown"
                        setIsClicked={(value) =>
                            toggleDropdown('profile', value)
                        }
                        clicked={isDropdownActive('profile')}
                    />
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
