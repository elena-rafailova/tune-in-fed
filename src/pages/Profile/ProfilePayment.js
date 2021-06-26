import React, { useEffect, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import Card from '../../components/UIElements/Card';
import Button from '../../components/FormElements/Button';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import { formatDate } from '../../util/helpers';
import '../Auth/Auth.scss';
import './Profile.scss';

const ProfilePayment = () => {
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest } = useHttpClient();
    const [planInfo, setPlanInfo] = useState();

    const savePlan = async () => {
        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL +
                    '/plans/savePlan/' +
                    auth.user.planId,
                'GET',
                null,
                {
                    Authorization: 'Bearer ' + auth.token,
                }
            );

            if (responseData.success) {
                let newUser = {
                    ...auth.user,
                    isSubActive: true,
                    nextPaymentDate: responseData.nextPaymentDate,
                };
                auth.updateUser(newUser);
                toast.success('You have successfully subscribed!');
            }
        } catch (err) {}
    };

    const getLastingFreeTrial = () => {
        if (auth.user.isFreeTrial) {
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            const regDate = new Date(auth.user.regDate);
            const now = new Date();
            // Discard the time and time-zone information.
            const regDateUTC = Date.UTC(
                regDate.getFullYear(),
                regDate.getMonth(),
                regDate.getDate()
            );
            const nowUTC = Date.UTC(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

            let diffDays = Math.floor((nowUTC - regDateUTC) / _MS_PER_DAY);
            return diffDays >= 14 ? 0 : 14 - diffDays;
        }

        return 0;
    };

    useEffect(() => {
        const getPlanInfo = async () => {
            if (auth.user.planId) {
                try {
                    const responseData = await sendRequest(
                        process.env.REACT_APP_BACKEND_URL +
                            '/plans/getPlanInfo/' +
                            auth.user.planId,
                        'GET',
                        null,
                        {
                            Authorization: 'Bearer ' + auth.token,
                        }
                    );

                    if (responseData.success) {
                        setPlanInfo(responseData.plan);
                    }
                } catch (err) {}
            }
        };

        getPlanInfo();
    }, []);

    return (
        <React.Fragment>
            {auth.user.planId ? (
                <div>
                    <Card className="authentication">
                        {isLoading && <LoadingSpinner asOverlay />}
                        {planInfo && (
                            <div>
                                <h2>Subscription Information</h2>
                                <hr />
                                <div className="payment-info-container">
                                    <h2>{planInfo.title}</h2>
                                    <h3>{planInfo.description}</h3>
                                    <div className="plan-price-info">
                                        <b>{planInfo.price} BGN</b> /{' '}
                                        {planInfo.paymentType === 1
                                            ? 'monthly'
                                            : 'yearly'}
                                    </div>
                                    <div className="payment-date">
                                        Next payment date:{' '}
                                        {formatDate(auth.user.nextPaymentDate)}
                                    </div>
                                </div>
                            </div>
                        )}
                        <Button href={'/'}>See all plans</Button>
                        <Button
                            onClick={savePlan}
                            disabled={auth.user.isSubActive}
                            danger
                        >
                            Pay
                        </Button>
                    </Card>
                </div>
            ) : (
                <Card className="authentication payment-info-container">
                    <h2 className="ta-center">
                        You haven't subscribed to any plan yet! <br />
                    </h2>
                    <b className="payment-date ta-center">
                        Your free trial{' '}
                        {getLastingFreeTrial() === 0
                            ? 'has expired!'
                            : `expires in ${getLastingFreeTrial()} days!`}
                    </b>
                </Card>
            )}
        </React.Fragment>
    );
};

export default ProfilePayment;
