import React, { useContext } from 'react';
import { withRouter } from 'react-router';

import Card from '../UIElements/Card';
import Button from '../FormElements/Button';
import TickIcon from '../../assets/icons/double-tick.png';
import { AuthContext } from '../../context/auth-context';
import './Plan.scss';

const Plan = ({ plan, history }) => {
    const auth = useContext(AuthContext);

    const savePlan = () => {
        console.log('send request to save users plan');
    };

    return (
        <li className="plan-container">
            <Card className="plan-item__content">
                <h2>{plan.title}</h2>
                <div className="plan-item__info">
                    <h3>{plan.description}</h3>
                </div>
                <div className="plan-item__details">
                    <div>
                        <img src={TickIcon} alt="" />
                        <span>Play any story</span>
                    </div>
                    <div>
                        <img src={TickIcon} alt="" />
                        <span>No ad interruptions</span>
                    </div>
                    <div>
                        <img src={TickIcon} alt="" />
                        <span>Unlimited skips</span>
                    </div>
                </div>
                <div className="plan-price-info">
                    <b>{plan.price} BGN </b> /{' '}
                    {plan.paymentType === 1 ? 'monthly' : 'yearly'}
                </div>
                <Button
                    disabled={auth.user.isSubActive}
                    onClick={() =>
                        auth.token ? savePlan(plan.id) : history.push('/auth')
                    }
                >
                    {auth.token ? 'Subscribe' : 'Try free for 14 days'}
                </Button>
            </Card>
        </li>
    );
};

export default withRouter(Plan);
