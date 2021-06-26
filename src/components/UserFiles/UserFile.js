import React from 'react';

import Card from '../UIElements/Card';
import './UserFile.scss';

const UserFile = ({ file }) => {
    return (
        <a href={`/file/${file._id}`} className="user-list-item">
            <Card className="user-list-item__content">
                <div className="user-list-item__image">
                    <img
                        src={`${process.env.REACT_APP_ASSET_URL}/${file.thumbUrl}`}
                        alt={file.title}
                    />
                </div>
                <div className="user-list-item__info">
                    <h2>{file.title}</h2>
                    <h3>{file.creator}</h3>
                </div>
            </Card>
        </a>
    );
};

export default UserFile;
