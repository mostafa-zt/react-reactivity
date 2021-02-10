import React from 'react';
import { combineValidators, isRequired } from 'revalidate';
import { IProfile } from '../../app/models/profile';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Label } from 'semantic-ui-react';

const validate = combineValidators({
    displayName: isRequired('displayName')
});

interface IProps {
    updateProfile: (profile: IProfile) => void;
    profile: IProfile;
    setEditMode: (editMode: boolean) => void;
}

const ProfileEditForm: React.FC<IProps> = ({ profile, updateProfile, setEditMode }) => {
    return (
        <FinalForm
            onSubmit={updateProfile}
            validate={validate}
            initialValues={profile}
            render={({ handleSubmit, invalid, pristine, submitting, form }) => (
                <Form onSubmit={() => { const result = handleSubmit(); if (result) result.then(() => { setEditMode(false); }) }}>
                    <Field name="displayName">
                        {({ input, meta }) => (
                            <Form.Field error={meta.touched && !!meta.error}>
                                <input {...input} type="text" placeholder="Display Name" />
                                {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                            </Form.Field>
                        )}
                    </Field>
                    <Field name="bio">
                        {({ input, meta }) => (
                            <Form.Field error={meta.touched && !!meta.error}>
                                <textarea rows={5} {...input} placeholder="Write something as your Bio" />
                                {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                            </Form.Field>
                        )}
                    </Field>
                    <Button floated='right' type='submit' loading={submitting} content='Update Profile' color='green' disabled={invalid || pristine} />
                </Form>
            )}
        />
    )
}

export default ProfileEditForm
