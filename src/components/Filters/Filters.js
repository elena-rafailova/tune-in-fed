import React, { useState, useEffect } from 'react';

import Dropdown from '../Navigation/Dropdown';
import SortIcon from '../../assets/icons/sort.png';
import LanguageIcon from '../../assets/icons/language.png';
import HeadphonesIcon from '../../assets/icons/headphones.png';
import DeleteIcon from '../../assets/icons/delete.png';
import { ReactComponent as IconArrow } from '../../assets/icons/up-arrow.svg';
import './Filters.scss';

const Filters = ({ filesOriginal, setFilesCopy }) => {
    const SESSION_STORAGE_FILTERS_KEY = 'filters';

    const FILTER_TYPES = {
        filter: 1,
        sort: 2,
    };

    const [dropdown, setDropdown] = useState({});
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
            <div onClick={() => toggleDropdown('type')}>
                <div
                    className={`filter center ${
                        isDropdownActive('type') ? 'active' : ''
                    }`}
                >
                    <img src={HeadphonesIcon} alt="type" />{' '}
                    {filtersToApply.type ? filtersToApply.type.title : 'TYPE'}
                    {filtersToApply.type ? (
                        <img
                            src={DeleteIcon}
                            alt="delete"
                            onClick={() => removeFilter('type')}
                        />
                    ) : (
                        <IconArrow />
                    )}
                </div>
                {isDropdownActive('type') && <Dropdown items={typeOptions} />}
            </div>

            <div onClick={() => toggleDropdown('language')}>
                <div
                    className={`filter center ${
                        isDropdownActive('language') ? 'active' : ''
                    }`}
                >
                    <img src={LanguageIcon} alt="language" />{' '}
                    {filtersToApply.language
                        ? filtersToApply.language.title
                        : 'LANGUAGE'}
                    {filtersToApply.language ? (
                        <img
                            src={DeleteIcon}
                            alt="delete"
                            onClick={() => removeFilter('language')}
                        />
                    ) : (
                        <IconArrow />
                    )}
                </div>
                {isDropdownActive('language') && (
                    <Dropdown items={langOptions} />
                )}
            </div>
            <div onClick={() => toggleDropdown('sort')}>
                <div
                    className={`filter center ${
                        isDropdownActive('sort') ? 'active' : ''
                    }`}
                >
                    <img src={SortIcon} alt="sort" />{' '}
                    {filtersToApply.sort ? filtersToApply.sort.title : 'SORT'}
                    {filtersToApply.sort ? (
                        <img
                            src={DeleteIcon}
                            alt="delete"
                            onClick={() => removeFilter('sort')}
                        />
                    ) : (
                        <IconArrow />
                    )}
                </div>
                {isDropdownActive('sort') && <Dropdown items={sortOptions} />}
            </div>
        </div>
    );
};

export default Filters;
