import React, { useEffect, useState, useContext } from 'react';
import { useParams, withRouter } from 'react-router';
import { toast } from 'react-toastify';

import Card from '../../components/UIElements/Card';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import LanguageIcon from '../../assets/icons/language.png';
import CategoryIcon from '../../assets/icons/category.png';
import AudiobookIcon from '../../assets/icons/audiobook-icon.png';
import PodcastIcon from '../../assets/icons/podcast-icon.png';
import { ReactComponent as HeartIcon } from '../../assets/icons/heart-icon.svg';
import './FileDetails.scss';

const FileDetails = ({ history }) => {
    let { id } = useParams();
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest } = useHttpClient();
    const [file, setFile] = useState();
    const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
    const [isInWishlist, setIsInWishlist] = useState(null);

    const toggleWishlist = async (fileId) => {
        if (!auth.token) {
            history.push('/auth');
        } else {
            try {
                let state = !isFileInWishlist(fileId);
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL +
                        '/library/toggleWishlist',
                    'POST',
                    JSON.stringify({
                        fileId: fileId,
                        state: +state,
                    }),
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token,
                    }
                );

                if (responseData.success) {
                    setIsInWishlist(state);
                    auth.updateUser({
                        ...auth.user,
                        wishlist: responseData.wishlist,
                    });
                    let message = `You have successfully ${
                        state ? 'added' : 'removed'
                    } file ${state ? 'to' : 'from'} wishlist!`;
                    toast.success(message);
                }
            } catch (err) {}
        }
    };

    const toggleCurrents = async (fileId) => {
        if (!auth.token) {
            history.push('/auth');
        } else {
            try {
                let state = !auth.user.currents.includes(fileId);
                if (state) {
                    const responseData = await sendRequest(
                        process.env.REACT_APP_BACKEND_URL +
                            '/library/toggleCurrents',
                        'POST',
                        JSON.stringify({
                            fileId: fileId,
                            state: +state,
                        }),
                        {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + auth.token,
                        }
                    );

                    if (responseData.success) {
                        auth.updateUser({
                            ...auth.user,
                            currents: responseData.currents,
                        });
                    }
                }
            } catch (err) {}
        }
    };

    const toggleArchive = async (fileId) => {
        if (!auth.token) {
            history.push('/auth');
        } else {
            try {
                let state = !auth.user.archive.includes(fileId);
                if (state) {
                    const responseData = await sendRequest(
                        process.env.REACT_APP_BACKEND_URL +
                            '/library/toggleArchive',
                        'POST',
                        JSON.stringify({
                            fileId: fileId,
                            state: +state,
                        }),
                        {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + auth.token,
                        }
                    );

                    if (responseData.success) {
                        auth.updateUser({
                            ...auth.user,
                            archive: responseData.archive,
                            currents: responseData.currents,
                        });
                    }
                }
            } catch (err) {}
        }
    };

    const isFileInWishlist = (fileId) => {
        return (
            (auth.isLoggedIn && auth.user.wishlist.includes(fileId)) || false
        );
    };

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
            {isLoading && !file && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {file && (
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
                            <HeartIcon
                                className={`heart-icon ${
                                    isFileInWishlist(file.id) || isInWishlist
                                        ? 'active'
                                        : ''
                                }`}
                                onClick={() => toggleWishlist(file.id)}
                            />
                            <h1 className="ta-center title">{file.title}</h1>
                            <h3 className="creator">{file.creator}</h3>
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
                                onPlay={() => toggleCurrents(file.id)}
                                onFinish={() => toggleArchive(file.id)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withRouter(FileDetails);
