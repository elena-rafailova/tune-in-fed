import React, { useEffect, useContext, useState } from 'react';

import Card from '../../components/UIElements/Card';
import Button from '../../components/FormElements/Button';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import { formatDate } from '../../util/helpers';
import '../Auth/Auth.scss';
import './Profile.scss';

const ProfilePayment = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
            }
        } catch (err) {}
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
                        console.log(responseData.plan);
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
                    <ErrorModal error={error} onClear={clearError} />
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
                <Card className="authentication">
                    <div>You have not subscribed to any plan yet!</div>
                </Card>
            )}
        </React.Fragment>
    );
};

export default ProfilePayment;
