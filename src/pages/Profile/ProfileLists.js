import React, { useEffect, useContext, useState } from 'react';

import Card from '../../components/UIElements/Card';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import UserFilesList from '../../components/UserFiles/UserFilesList';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import './Profile.scss';

const ProfileLists = () => {
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest } = useHttpClient();
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
        <div className="center lists-container">
            <Card className="list">
                {isLoading && <LoadingSpinner asOverlay />}
                {lists && lists.wishlist && lists.wishlist.length ? (
                    <div>
                        <h3>Wishlist</h3>
                        <div className="list-items small-lightblue-scrollbar">
                            <UserFilesList items={lists.wishlist} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3>Wishlist</h3>
                        <h4>You don't have any wishlist files yet.</h4>
                    </div>
                )}
            </Card>
            <Card className="list">
                {isLoading && <LoadingSpinner asOverlay />}
                {lists && lists.currents && lists.currents.length ? (
                    <div>
                        <h3>Keep listening to</h3>
                        <div className="list-items small-lightblue-scrollbar">
                            <UserFilesList items={lists.currents} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3>Keep listening to</h3>
                        <h4>You don't have any current listens yet.</h4>
                    </div>
                )}
            </Card>
            <Card className="list">
                {isLoading && <LoadingSpinner asOverlay />}
                {lists && lists.archive && lists.archive.length ? (
                    <div>
                        <h3>Watch again</h3>
                        <div className="list-items small-lightblue-scrollbar">
                            <UserFilesList items={lists.archive} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3>Watch again</h3>
                        <h4>You don't have any listened files yet.</h4>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProfileLists;
