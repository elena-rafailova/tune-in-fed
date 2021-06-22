import React, { useEffect, useState } from 'react';

import FilesList from '../../components/File/FilesList';
import SubscriptionsList from '../../components/Subscription/SubscriptionsList';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';

const Home = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedFiles, setLoadedFiles] = useState();
    const [loadedSubscriptions, setLoadedSubscriptions] = useState();
    const [newFiles, setNewFiles] = useState();

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/plans'
                );

                setLoadedSubscriptions(responseData.plans);
            } catch (err) {}
        };
        fetchSubscriptions();

        const fetchFiles = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/library'
                );

                setLoadedFiles(responseData.files);
            } catch (err) {}
        };
        fetchFiles();
    }, [sendRequest]);

    useEffect(() => {
        if (loadedFiles) {
            setNewFiles(
                loadedFiles.filter((file) => {
                    let hasNew = file.categories.find(
                        (cat) => cat.title === 'new'
                    );

                    return typeof hasNew !== 'undefined';
                })
            );
        }
    }, [loadedFiles]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedSubscriptions && (
                <SubscriptionsList items={loadedSubscriptions} />
            )}
            {!isLoading && newFiles && (
                <div>
                    <h1 className="ta-center m-10 mt-30">New Additions</h1>
                    <FilesList items={newFiles} />
                </div>
            )}
            {!isLoading && loadedFiles && (
                <div>
                    <h1 className="ta-center m-10 mt-30">All</h1>
                    <FilesList items={loadedFiles} />
                </div>
            )}
        </React.Fragment>
    );
};

export default Home;
