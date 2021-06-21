import React from 'react';

import UserItem from './UserItem';
import Card from '../UIElements/Card';
import './UsersList.scss';

const UsersList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className="center">
                <Card>
                    <h2>No files found.</h2>
                </Card>
            </div>
        );
    }

    return (
        <ul className="users-list">
            {props.items.map((user) => (
                <UserItem
                    key={user.id}
                    id={user.id}
                    image={user.thumbUrl}
                    name={user.title}
                />
            ))}
        </ul>
    );
};

export default UsersList;
