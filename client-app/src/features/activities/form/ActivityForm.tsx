import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Grid, Segment, Label, Select } from 'semantic-ui-react';
import { ActivityFormValues, IActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Loading from '../../../app/layout/Loading';
import { Form as FinalForm, Field } from 'react-final-form';
import { category } from './categoryOptions';
import { DatePicker, TimeInput } from 'react-widgets';
import { combinedDateAndTime } from '../../../app/common/util/util';
import { toast } from 'react-toastify';
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
    title: isRequired({ message: 'Title is required' }),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(5)({ message: 'Description needs to be at least 5 character' })
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time'),
})

interface MatchParams {
    id: string
}

const ActivityForm: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {

    const rootStore = useContext(RootStoreContext);
    const { createActivity, editActivity, submitting, loadActivity, loadingInitial } = rootStore.activityStore;
    const [activity, setActivity] = useState<IActivityFormValues>(new ActivityFormValues());
    const history = useHistory();

    useEffect(() => {
        if (match.params.id) {
            loadActivity(match.params.id).then(activity => {
                setActivity(new ActivityFormValues(activity));
            });
        }
        // .then(() => selectedActivity && setActivity(selectedActivity))
        // unsubscription props when component unmount
        // return (() => {
        //     clearActivity();
        // })
    }, [loadActivity, match.params.id])


    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combinedDateAndTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        if (!activity.id) {
            let newActivity = { ...activity, id: uuid() }
            createActivity(newActivity)
                .then(() => history.push(`/activities/${newActivity.id}`))
                .catch(() => { toast.error('Server Error') });
        } else {
            editActivity(activity)
                .then(() => history.push(`/activities/${activity.id}`));
        }
    }

    // const handleInputChanges = (event: any) => {
    //     const { name, value } = event.target;
    //     setActivity({ ...activity, [name]: value });
    // }

    if (loadingInitial) return (<Loading content='App is loading...' />)

    return (
        <Grid style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid.Column width={10}>
                <Segment clearing >
                    <FinalForm validate={validate} onSubmit={handleFinalFormSubmit} initialValues={activity}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form onSubmit={handleSubmit}>
                                <Field name="title">
                                    {({ input, meta }) => (
                                        <Form.Field error={meta.touched && !!meta.error}>
                                            <input {...input} type="text" placeholder="Title" />
                                            {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                                        </Form.Field>
                                    )}
                                </Field>
                                <Field name="description">
                                    {({ input, meta }) => (
                                        <Form.Field error={meta.touched && !!meta.error} width={16}>
                                            <textarea rows={5}  {...input} placeholder="Description" />
                                            {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                                        </Form.Field>
                                    )}
                                </Field>
                                <Field name="category">
                                    {({ input, meta }) => (
                                        <Form.Field error={meta.touched && !!meta.error} width={16}>
                                            <Select
                                                value={input.value}
                                                onChange={(e, data) => input.onChange(data.value)}
                                                placeholder='Category'
                                                options={category}
                                            />
                                            {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                                        </Form.Field>
                                    )}
                                </Field>

                                <Form.Group widths='equal'>
                                    <Field name="date">
                                        {({ input, meta }) => (
                                            <Form.Field error={meta.touched && !!meta.error} width={16} >
                                                <DatePicker
                                                    placeholder='Date' onBlur={input.onBlur} onKeyDown={(e) => e.preventDefault()}
                                                    value={input.value ? new Date(input.value) : null}
                                                    onChange={input.onChange}
                                                    messages={{ dateButton: 'Date', timeButton: 'Time' }}
                                                />
                                                {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                                            </Form.Field>
                                        )}
                                    </Field>
                                    <Field name="time">
                                        {({ input, meta }) => (
                                            <Form.Field error={meta.touched && !!meta.error} width={16} >
                                                <TimeInput
                                                    placeholder='Time' onBlur={input.onBlur}
                                                    value={input.value ? new Date(input.value) : null}
                                                    onChange={input.onChange}
                                                />
                                                {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                                            </Form.Field>
                                        )}
                                    </Field>
                                </Form.Group>
                                <Field name="city">
                                    {({ input, meta }) => (
                                        <Form.Field error={meta.touched && !!meta.error} width={16}>
                                            <input type="text" {...input} placeholder="City" />
                                            {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                                        </Form.Field>
                                    )}
                                </Field>
                                <Field name="venue">
                                    {({ input, meta }) => (
                                        <Form.Field error={meta.touched && !!meta.error} width={16}>
                                            <input type="text" {...input} placeholder="Venue" />
                                            {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                                        </Form.Field>
                                    )}
                                </Field>
                                <Button floated='right' type='submit' content='Submit' color='green' disabled={invalid || pristine} loading={submitting} />
                                <Button onClick={() => activity.id ? history.push(`/activities/${activity.id}`) : history.push('/activities')} floated='right' type='button' content='Cancel' color='grey' />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityForm)
