import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import ErrorModal from '../../components/UIElements/ErrorModal';
import Card from '../../components/UIElements/Card';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import { useHttpClient } from '../../hooks/http-hook';
import LanguageIcon from '../../assets/icons/language.png';
import CategoryIcon from '../../assets/icons/category.png';
import AudiobookIcon from '../../assets/icons/audiobook-icon.png';
import PodcastIcon from '../../assets/icons/podcast-icon.png';
import { ReactComponent as HeartIcon } from '../../assets/icons/heart-icon.svg';
import './FileDetails.scss';

const FileDetails = () => {
    let { id } = useParams();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [file, setFile] = useState();
    const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/library/' + id
                );

                setFile(responseData.file);
            } catch (err) {}
        };
        fetchFile();
    }, [sendRequest, id]);

    return (
        <div>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && file && (
                <div className="file-details-container">
                    <div className="details-container">
                        <div>
                            <img
                                className="file-image"
                                src={
                                    process.env.REACT_APP_ASSET_URL +
                                    '/' +
                                    file.thumbUrl
                                }
                                alt={file.title}
                            />
                            <div>
                                <img
                                    className="type-icon"
                                    src={
                                        file.type === 2
                                            ? PodcastIcon
                                            : AudiobookIcon
                                    }
                                    alt={
                                        file.type === 2
                                            ? 'podcast'
                                            : 'audiobook'
                                    }
                                />
                                {file.type === 1 ? (
                                    <b>AUDIOBOOK</b>
                                ) : (
                                    <b>PODCAST</b>
                                )}
                            </div>
                        </div>
                        <div className="main-info-container">
                            <HeartIcon className="heart-icon" />
                            <h1 className="ta-center">{file.title}</h1>
                            <h3>{file.creator}</h3>
                            <br />
                            <p>{file.description}</p>
                            <br />
                            <div className="additional-info">
                                <span title="language">
                                    <img src={LanguageIcon} alt="language" />
                                    {file.language.ISO}
                                </span>
                                <br />
                                <span title="categories">
                                    <img src={CategoryIcon} alt="categories" />
                                </span>
                                {file.categories.map((cat, index) => {
                                    return (
                                        <React.Fragment key={cat.id}>
                                            <a
                                                className="category-link"
                                                href={`/library/${cat.title}`}
                                            >
                                                {cat.title}
                                            </a>
                                            {index < file.categories.length - 1
                                                ? ', '
                                                : ''}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="listening-station-container">
                        <div className="episodes-container">
                            <h3>Episodes</h3>
                            <div className="episodes small-lightblue-scrollbar">
                                {file.episodes.map((episode, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setSelectedTrackIndex(index);
                                            }}
                                        >
                                            <Card className="center episode-container">
                                                <img
                                                    src={
                                                        process.env
                                                            .REACT_APP_ASSET_URL +
                                                        '/' +
                                                        episode.thumbUrl
                                                    }
                                                    alt={episode.title}
                                                />
                                                <div>{episode.title}</div>
                                            </Card>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <AudioPlayer
                                key={selectedTrackIndex}
                                tracks={file.episodes}
                                artistName={file.creator}
                                selectedTrackIndex={selectedTrackIndex}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileDetails;
