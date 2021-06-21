import React, { useEffect, useState } from 'react';

import UsersList from '../../components/User/UsersList';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';

const Home = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedFiles, setLoadedFiles] = useState();
    const [loadedSubscriptions, setLoadedSubscriptions] = useState();

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/plans'
                );

                console.log(responseData);
                setLoadedSubscriptions(responseData.plans);
            } catch (err) {}
        };
        fetchSubscriptions();

        const fetchFiles = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/library'
                );

                console.log(responseData);
                setLoadedFiles(responseData.files);
            } catch (err) {}
        };
        fetchFiles();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedSubscriptions && (
                <div>Loaded subscriptions</div>
            )}
            {!isLoading && loadedFiles && <UsersList items={loadedFiles} />}
        </React.Fragment>
    );
};

export default Home;
