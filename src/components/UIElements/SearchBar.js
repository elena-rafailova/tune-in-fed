import React from 'react';

import './SearchBar.scss';

const SeacrhBar = ({ setSearch }) => {
    return (
        <div className="search-bar center">
            <div>
                <input
                    type="text"
                    required
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={(e) => {
                        e.target.value = '';
                        setSearch('');
                    }}
                />
            </div>
        </div>
    );
};

export default SeacrhBar;
