import React, { useState, useEffect, useRef } from 'react';
import randomColor from 'randomcolor';

import AudioControls from './AudioControls';
import './AudioPlayer.scss';

const AudioPlayer = ({
    tracks,
    artistName,
    selectedTrackIndex,
    onPlay,
    onFinish,
}) => {
    const [trackIndex, setTrackIndex] = useState(0);
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const fileInfo = {
        title: tracks[trackIndex].title,
        image:
            process.env.REACT_APP_ASSET_URL + '/' + tracks[trackIndex].thumbUrl,
        audioSrc:
            process.env.REACT_APP_ASSET_URL + '/' + tracks[trackIndex].fileUrl,
        artist: artistName,
    };

    let color = randomColor();

    const audioRef = useRef(new Audio(fileInfo.audioSrc));
    const intervalRef = useRef();
    const isReady = useRef(false);

    const { duration } = audioRef.current;

    const getTimeString = (seconds) => {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    };

    const currentPercentage = duration
        ? `${(trackProgress / duration) * 100}%`
        : '0%';
    const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                toNextTrack();
            } else {
                setTrackProgress(audioRef.current.currentTime);
            }
        }, [1000]);
    };

    const onScrub = (value) => {
        // Clear any timers already running
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
    };

    const onScrubEnd = () => {
        // If not already playing, start
        if (!isPlaying) {
            setIsPlaying(true);
        }

        if (parseInt(trackProgress) === parseInt(duration)) {
            setIsPlaying(false);
        }

        startTimer();
    };

    const toPrevTrack = () => {
        if (trackIndex - 1 < 0) {
            setTrackIndex(tracks.length - 1);
        } else {
            setTrackIndex(trackIndex - 1);
        }
        onPlay();
    };

    const toNextTrack = () => {
        if (trackIndex < tracks.length - 1) {
            setTrackIndex(trackIndex + 1);
        } else {
            setTrackIndex(0);
        }
        onPlay();
    };

    useEffect(() => {
        if (isPlaying) {
            onPlay();
            audioRef.current.play();
            startTimer();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (parseInt(trackProgress) === parseInt(duration)) {
            onFinish();
            setIsPlaying(false);
        }
    }, [trackProgress]);

    useEffect(() => {
        document.documentElement.style.setProperty('--active-color', color);
    }, [trackIndex, color]);

    // Handles cleanup and setup when changing tracks
    useEffect(() => {
        audioRef.current.pause();

        audioRef.current = new Audio(fileInfo.audioSrc);
        setTrackProgress(audioRef.current.currentTime);

        if (isReady.current) {
            audioRef.current.play();
            setIsPlaying(true);
            startTimer();
        } else {
            // Set the isReady ref as true for the next pass
            isReady.current = true;
        }
    }, [trackIndex]);

    useEffect(() => {
        if (selectedTrackIndex) {
            setTrackIndex(selectedTrackIndex);
        }
    }, []);

    useEffect(() => {
        // Pause and clean up on unmount
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className={`audio-player ${isPlaying ? 'active' : ''}`}>
            <div className="track-info">
                <img
                    className="artwork"
                    src={fileInfo.image}
                    alt={`track artwork for ${fileInfo.title} by ${fileInfo.artist}`}
                />
                <h2 className="title">{fileInfo.title}</h2>
                <h3 className="artist">{fileInfo.artist}</h3>
                <AudioControls
                    isPlaying={isPlaying}
                    onPrevClick={toPrevTrack}
                    onNextClick={toNextTrack}
                    onPlayPauseClick={setIsPlaying}
                />
                <input
                    type="range"
                    value={trackProgress}
                    step="1"
                    min="0"
                    max={duration ? duration : `${duration}`}
                    className="progress"
                    onChange={(e) => onScrub(e.target.value)}
                    onMouseUp={onScrubEnd}
                    onKeyUp={onScrubEnd}
                    style={{ background: trackStyling }}
                />
                <div>
                    {trackProgress && trackProgress > 0
                        ? getTimeString(trackProgress)
                        : '00:00:00'}{' '}
                    /{' '}
                    {duration && duration > 0
                        ? getTimeString(duration)
                        : '00:00:00'}
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
