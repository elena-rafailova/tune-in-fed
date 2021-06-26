import React from 'react';

import UserFile from './UserFile';
import './UserFilesList.scss';

const UserFilesList = (props) => {
    return (
        <div className="user-files-list">
            {props.items.map((file, index) => (
                <UserFile key={index} file={file} />
            ))}
        </div>
    );
};

export default UserFilesList;
