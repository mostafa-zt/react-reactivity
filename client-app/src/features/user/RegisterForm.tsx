import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header, Label } from 'semantic-ui-react';
import ErrorMessage from '../../app/common/messages/ErrorMessage';
import { IUserFromValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';

const validate = combineValidators({
    username: isRequired('Username'),
    displayname: isRequired('Display Name'),
    email: isRequired('Email'),
    password: isRequired('Password')
});

const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { register } = rootStore.userStore;

    return (
        <FinalForm
            onSubmit={(values: IUserFromValues) => register(values).catch(error => (
                {
                    [FORM_ERROR]: error
                }
            ))}
            validate={validate}
            render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as='h2' content='Register' color='teal' textAlign='center' />
                    <Field name="username">
                        {({ input, meta }) => (
                            <Form.Field error={meta.touched && !!meta.error}>
                                <input {...input} type="text" placeholder="Username" />
                                {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                            </Form.Field>
                        )}
                    </Field>
                    <Field name="email">
                        {({ input, meta }) => (
                            <Form.Field error={meta.touched && !!meta.error}>
                                <input {...input} type="text" placeholder="Email" />
                                {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                            </Form.Field>
                        )}
                    </Field>
                    <Field name="displayname">
                        {({ input, meta }) => (
                            <Form.Field error={meta.touched && !!meta.error}>
                                <input {...input} type="text" placeholder="DisplayName" />
                                {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                            </Form.Field>
                        )}
                    </Field>
                    <Field name="password">
                        {({ input, meta }) => (
                            <Form.Field error={meta.touched && !!meta.error}>
                                <input {...input} type="password" placeholder="Password" />
                                {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                            </Form.Field>
                        )}
                    </Field>
                    {submitError && !dirtySinceLastSubmit &&
                        <ErrorMessage error={submitError} />
                    }
                    <br />
                    <Button disabled={invalid && pristine && !dirtySinceLastSubmit} loading={submitting} type='submit' content='Register' color='teal' fluid />
                    {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
                </Form>
            )}
        />
    )
}

export default RegisterForm
