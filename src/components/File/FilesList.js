import React from 'react';

import FileItem from './FileItem';
import './FilesList.scss';

const FilesList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className="center">
                <h2>No files found.</h2>
            </div>
        );
    }

    return (
        <ul className="files-list">
            {props.items.map((file, index) => (
                <FileItem key={index} file={file} />
            ))}
        </ul>
    );
};

export default FilesList;
