import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header, Label } from 'semantic-ui-react';
import ErrorMessage from '../../app/common/messages/ErrorMessage';
import { IUserFromValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
});

const LoginForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { login } = rootStore.userStore;

    return (
        <FinalForm
            onSubmit={(values: IUserFromValues) => login(values).catch(error => (
                {
                    [FORM_ERROR]: error
                }
            ))}
            validate={validate}
            render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as='h2' content='Login' color='teal' textAlign='center' />
                    <Field name="email">
                        {({ input, meta }) => (
                            <Form.Field error={meta.touched && !!meta.error}>
                                <input {...input} type="text" placeholder="Email" />
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
                       <ErrorMessage text={'Invalid username or password'} />
                    }
                    <br />
                    <Button disabled={invalid && pristine && !dirtySinceLastSubmit} loading={submitting} type='submit' content='Login' color='teal' fluid />
                    {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
                </Form>
            )}
        />
    )
}

export default LoginForm
