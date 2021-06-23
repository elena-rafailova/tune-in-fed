import React from 'react';

import Plan from './Plan';
import './SubscriptionsList.scss';

const SubscriptionsList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className="center">
                <h2>No plans found.</h2>
            </div>
        );
    }

    return (
        <div className="plans-wrapper">
            <h1>Our subscriptions</h1>
            <h3>
                Are you ready to dive into a sea of stories? Choose the
                subscription plan that meets your needs. We have something for
                everyone.
            </h3>
            <h3>Subscribe and start listening today.</h3>
            <ul className="plans-list">
                {props.items.map((plan, index) => (
                    <Plan key={index} plan={plan} />
                ))}
            </ul>
        </div>
    );
};

export default SubscriptionsList;
