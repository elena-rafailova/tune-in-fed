import React, { useState, useEffect, useCallback } from 'react';

import Dropdown from '../Navigation/Dropdown';
import SortIcon from '../../assets/icons/sort.png';
import LanguageIcon from '../../assets/icons/language.png';
import HeadphonesIcon from '../../assets/icons/headphones.png';
import useClickOutside from '../../hooks/click-outside-hook';
import { ReactComponent as ArrowIcon } from '../../assets/icons/up-arrow.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete-icon.svg';
import './Filters.scss';

const Filters = ({ filesOriginal, setFilesCopy }) => {
    const SESSION_STORAGE_FILTERS_KEY = 'filters';

    const FILTER_TYPES = {
        filter: 1,
        sort: 2,
    };

    const [dropdownsState, setDropdownsState] = useState({
        type: false,
        sort: false,
        language: false,
    });
    const [filtersToApply, setFiltersToApply] = useState(
        JSON.parse(sessionStorage.getItem(SESSION_STORAGE_FILTERS_KEY)) || {}
    );

    const typeOptions = [
        {
            title: 'AUDIOBOOK',
            function: () =>
                saveFilters(
                    'AUDIOBOOK',
                    'type',
                    FILTER_TYPES.filter,
                    'type',
                    1
                ),
            cName: 'dropdown-link',
        },
        {
            title: 'PODCAST',
            function: () =>
                saveFilters('PODCAST', 'type', FILTER_TYPES.filter, 'type', 2),
            cName: 'dropdown-link',
        },
    ];

    const langOptions = [
        {
            title: 'ENGLISH (EN)',
            function: () =>
                saveFilters(
                    'ENGLISH (EN)',
                    'language',
                    FILTER_TYPES.filter,
                    'language',
                    'EN',
                    'ISO'
                ),
            cName: 'dropdown-link',
        },
        {
            title: 'BULGARIAN (BG)',
            function: () =>
                saveFilters(
                    'BULGARIAN (BG)',
                    'language',
                    FILTER_TYPES.filter,
                    'language',
                    'BG',
                    'ISO'
                ),
            cName: 'dropdown-link',
        },
    ];

    const sortOptions = [
        {
            title: 'AUTHOR',
            function: () =>
                saveFilters('AUTHOR', 'sort', FILTER_TYPES.sort, 'creator'),
            cName: 'dropdown-link',
        },
        {
            title: 'TITLE',
            function: () =>
                saveFilters('TITLE', 'sort', FILTER_TYPES.sort, 'title'),
            cName: 'dropdown-link',
        },
    ];

    const filterFiles = (files, prop, value, additionalProp) => {
        return files.filter((file) => {
            return additionalProp
                ? file[prop][additionalProp] === value
                : file[prop] === value;
        });
    };

    const sortFiles = (files, prop) => {
        return files.sort((fileA, fileB) => {
            return fileA[prop] > fileB[prop]
                ? 1
                : fileA[prop] < fileB[prop]
                ? -1
                : 0;
        });
    };

    const dropdownLanguageRef = useClickOutside(
        useCallback(() => {
            if (dropdownsState.language) {
                toggleDropdown('language', false);
            }
        }, [dropdownsState.language])
    );

    const dropdownTypeRef = useClickOutside(
        useCallback(() => {
            if (dropdownsState.type) {
                toggleDropdown('type', false);
            }
        }, [dropdownsState.type])
    );

    const dropdownSortRef = useClickOutside(
        useCallback(() => {
            if (dropdownsState.sort) {
                toggleDropdown('sort', false);
            }
        }, [dropdownsState.sort])
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

    const saveFilters = (title, fName, type, prop, value, additionalProp) => {
        let isFilterApplied = Object.keys(filtersToApply).find(
            (filterName) => filterName === fName
        );

        if (isFilterApplied) {
            filtersToApply[fName] = {
                ...filtersToApply[fName],
                value: value,
                title,
            };
        } else {
            filtersToApply[fName] = {
                type,
                prop,
                value,
                additionalProp,
                title,
            };
        }

        setFiltersToApply({ ...filtersToApply });
        sessionStorage.setItem(
            SESSION_STORAGE_FILTERS_KEY,
            JSON.stringify(filtersToApply)
        );
    };

    const removeFilter = (fName) => {
        delete filtersToApply[fName];
        setFiltersToApply({ ...filtersToApply });
        sessionStorage.setItem(
            SESSION_STORAGE_FILTERS_KEY,
            JSON.stringify(filtersToApply)
        );
    };

    useEffect(() => {
        const applyFilters = () => {
            let filteredFiles = JSON.parse(JSON.stringify(filesOriginal));

            Object.values(filtersToApply).forEach((filter) => {
                if (+filter.type === +FILTER_TYPES.filter) {
                    filteredFiles = filterFiles(
                        filteredFiles,
                        filter.prop,
                        filter.value,
                        filter.additionalProp
                    );
                } else if (+filter.type === +FILTER_TYPES.sort) {
                    filteredFiles = sortFiles(filteredFiles, filter.prop);
                }
            });

            setFilesCopy(filteredFiles);
        };

        applyFilters();
    }, [filtersToApply]);

    return (
        <div className="center">
            <div
                ref={dropdownTypeRef}
                onClick={() => toggleDropdown('type', !dropdownsState.type)}
            >
                <div
                    className={`filter center ${
                        isDropdownActive('type') ? 'active' : ''
                    }
                        ${filtersToApply.type ? 'chosen' : ''}`}
                >
                    <img src={HeadphonesIcon} alt="type" />{' '}
                    {filtersToApply.type ? filtersToApply.type.title : 'TYPE'}
                    {filtersToApply.type ? (
                        <DeleteIcon
                            className="delete-icon"
                            onClick={() => removeFilter('type')}
                        />
                    ) : (
                        <ArrowIcon className="arrow-icon" />
                    )}
                </div>
                <Dropdown
                    items={typeOptions}
                    setIsClicked={(value) => toggleDropdown('type', value)}
                    clicked={isDropdownActive('type')}
                />
            </div>

            <div
                ref={dropdownLanguageRef}
                onClick={() =>
                    toggleDropdown('language', !dropdownsState.language)
                }
            >
                <div
                    className={`filter center ${
                        isDropdownActive('language') ? 'active' : ''
                    }
                    ${filtersToApply.language ? 'chosen' : ''}`}
                >
                    <img src={LanguageIcon} alt="language" />{' '}
                    {filtersToApply.language
                        ? filtersToApply.language.title
                        : 'LANGUAGE'}
                    {filtersToApply.language ? (
                        <DeleteIcon
                            className="delete-icon"
                            onClick={() => removeFilter('language')}
                        />
                    ) : (
                        <ArrowIcon className="arrow-icon" />
                    )}
                </div>
                <Dropdown
                    items={langOptions}
                    setIsClicked={(value) => toggleDropdown('language', value)}
                    clicked={isDropdownActive('language')}
                />
            </div>
            <div
                ref={dropdownSortRef}
                onClick={() => toggleDropdown('sort', !dropdownsState.sort)}
            >
                <div
                    className={`filter center ${
                        isDropdownActive('sort') ? 'active' : ''
                    }
                    ${filtersToApply.sort ? 'chosen' : ''}`}
                >
                    <img src={SortIcon} alt="sort" />{' '}
                    {filtersToApply.sort ? filtersToApply.sort.title : 'SORT'}
                    {filtersToApply.sort ? (
                        <DeleteIcon
                            className="delete-icon"
                            onClick={() => removeFilter('sort')}
                        />
                    ) : (
                        <ArrowIcon className="arrow-icon" />
                    )}
                </div>
                <Dropdown
                    items={sortOptions}
                    setIsClicked={(value) => toggleDropdown('sort', value)}
                    clicked={isDropdownActive('sort')}
                />
            </div>
        </div>
    );
};

export default Filters;
