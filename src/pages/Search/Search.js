import React, { useState, useEffect, useCallback } from 'react';

import SearchBar from '../../components/UIElements/SearchBar';
import FilesList from '../../components/File/FilesList';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import { debounce } from '../../util/helpers';
import './Search.scss';

const Search = () => {
    const httpClient = useHttpClient();
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState();

    const debounceSetSearch = useCallback(debounce(setSearch, 400), []);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const responseData = await httpClient.sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/library/search',
                    'POST',
                    JSON.stringify({
                        searchString: search,
                    }),
                    {
                        'Content-Type': 'application/json',
                    }
                );

                setSearchResults(responseData.files || []);
            } catch (err) {}
        };

        if (search.length >= 3) {
            fetchResults();
        }
    }, [search]);

    return (
        <div>
            <div className="search-wrapper ta-center">
                <h2>
                    TuneIn brings together your favorite audiobooks and podcasts
                    — hear what matters most to you!
                </h2>
                <h3>Find your favorite author/ creator or title right here!</h3>
                <SearchBar setSearch={debounceSetSearch} />
            </div>
            {httpClient.isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!httpClient.isLoading && typeof searchResults !== 'undefined' && (
                <FilesList items={searchResults} />
            )}
        </div>
    );
};

export default Search;
