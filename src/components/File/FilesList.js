import React from 'react';

import FileItem from './FileItem';
import Card from '../UIElements/Card';
import './FilesList.scss';

const FilesList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className="center">
                <Card>
                    <h2>No files found.</h2>
                </Card>
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
