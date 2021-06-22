import React from 'react';

import Card from '../UIElements/Card';
import AudiobookIcon from '../../assets/icons/audiobook-icon.png';
import PodcastIcon from '../../assets/icons/podcast-icon.png';
import './FileItem.scss';

const FileItem = ({ file }) => {
    return (
        <li className="file-item">
            <div
                className="type-wrapper center"
                title={file.type === 2 ? 'podcast' : 'audiobook'}
            >
                <img
                    className="type"
                    src={file.type === 2 ? PodcastIcon : AudiobookIcon}
                    alt={file.type === 2 ? 'podcast' : 'audiobook'}
                />
            </div>
            <a href={`/file/${file.id}`}>
                <Card className="file-item__content">
                    <div className="file-item__image">
                        <img
                            src={`${process.env.REACT_APP_ASSET_URL}/${file.thumbUrl}`}
                            alt={file.title}
                        />
                    </div>
                    <div className="file-item__info">
                        <h2>{file.title}</h2>
                        <h3>{file.creator}</h3>
                        <span>{file.language.ISO}</span>
                    </div>
                </Card>
            </a>
        </li>
    );
};

export default FileItem;
