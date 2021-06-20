import React from 'react';

import Avatar from '../UIElements/Avatar';
import Card from '../UIElements/Card';
import './UserItem.scss';

const UserItem = (props) => {
    return (
        <li className="user-item">
            <Card className="user-item__content">
                <div className="user-item__image">
                    <Avatar
                        image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
                        alt={props.name}
                    />
                </div>
                <div className="user-item__info">
                    <h2>{props.name}</h2>
                </div>
            </Card>
        </li>
    );
};

export default UserItem;
