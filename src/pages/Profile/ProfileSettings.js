import React, { useContext } from 'react';

import Card from '../../components/UIElements/Card';
import Input from '../../components/FormElements/Input';
import Button from '../../components/FormElements/Button';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import ImageUpload from '../../components/FormElements/ImageUpload';
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
    VALIDATOR_PASSWORD,
} from '../../util/validators';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import '../Auth/Auth.scss';

const ProfileSettings = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            password: {
                value: '',
                isValid: false,
            },
            repeatPassword: {
                value: '',
                isValid: false,
            },
        },
        false
    );

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', formState.inputs.name.value);
            formData.append('email', formState.inputs.email.value);
            formData.append('password', formState.inputs.password.value);
            formData.append(
                'repeatPassword',
                formState.inputs.repeatPassword.value
            );
            formData.append(
                'image',
                formState.inputs.image ? formState.inputs.image.value : ''
            );

            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/users/editProfile',
                'PUT',
                formData,
                {
                    Authorization: 'Bearer ' + auth.token,
                }
            );

            auth.updateUser(responseData.user);
        } catch (err) {}
    };

    const deleteAccount = async () => {
        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL +
                    '/users/deleteProfile/' +
                    auth.userId,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token,
                }
            );

            if (responseData.success) {
                auth.logout();
            }
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Settings</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    <Input
                        element="input"
                        id="name"
                        type="text"
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a name."
                        onInput={inputHandler}
                        initialValue={auth.user.name}
                        initialValid={true}
                    />
                    <ImageUpload
                        center
                        id="image"
                        onInput={inputHandler}
                        previewUrl={`${process.env.REACT_APP_ASSET_URL}/${auth.user.image}`}
                    />
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        onInput={inputHandler}
                        initialValue={auth.user.email}
                        initialValid={true}
                        disabled={true}
                    />
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters."
                        onInput={inputHandler}
                        initialValid={true}
                    />
                    <Input
                        element="input"
                        id="repeatPassword"
                        type="password"
                        label="Repeat password"
                        validators={[
                            VALIDATOR_PASSWORD(formState.inputs.password.value),
                        ]}
                        errorText="Please repeat the password."
                        onInput={inputHandler}
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        SAVE CHANGES
                    </Button>
                </form>
                <Button danger onClick={deleteAccount}>
                    DELETE MY ACCOUNT
                </Button>
            </Card>
        </React.Fragment>
    );
};

export default ProfileSettings;
