import React, { useEffect, useContext, useState } from 'react';

import Card from '../../components/UIElements/Card';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import UserFilesList from '../../components/UserFiles/UserFilesList';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import '../Auth/Auth.scss';
import './Profile.scss';

const ProfileLists = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [lists, setLists] = useState();

    useEffect(() => {
        const getUserLists = async () => {
            if (auth.user.planId) {
                try {
                    const responseData = await sendRequest(
                        process.env.REACT_APP_BACKEND_URL +
                            '/users/getUserLists/',
                        'GET',
                        null,
                        {
                            Authorization: 'Bearer ' + auth.token,
                        }
                    );

                    if (responseData.success) {
                        console.log(responseData);
                        setLists({
                            wishlist: responseData.wishlist,
                            currents: responseData.currents,
                            archive: responseData.archive,
                        });
                    }
                } catch (err) {}
            }
        };

        getUserLists();
    }, []);

    return (
        <div>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                {lists && (
                    <div>
                        <h3>Wishlist</h3>
                        <UserFilesList items={lists.wishlist} />
                        <h3>Keep listeting to</h3>
                        <UserFilesList items={lists.currents} />
                        <h3>Archive</h3>
                        <UserFilesList items={lists.archive} />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProfileLists;
