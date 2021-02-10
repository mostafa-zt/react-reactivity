import React, { Fragment, useContext, useEffect } from 'react'
import { Segment, Header, Form, Button, Comment, Label } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { Form as FinalForm, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';
import { combineValidators, isRequired } from 'revalidate';

const validate = combineValidators({
    body: isRequired('Comment'),
})

const ActivityDetailedChat = () => {
    const rootStore = useContext(RootStoreContext);
    const { createHubConnection, stopHubConnetion, addComment, selectedActivity } = rootStore.activityStore;

    useEffect(() => {
        createHubConnection();
        return () => {
            stopHubConnetion();
        }
    }, [createHubConnection, stopHubConnetion])

    return (
        <Fragment>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached>
                <Comment.Group>
                    {selectedActivity && selectedActivity.comments && selectedActivity.comments.map((comment) => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profile/${comment.username}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistance(comment.createAt, new Date())}</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}

                    <FinalForm validate={validate}
                        onSubmit={addComment}
                        render={({ handleSubmit, submitting, form  }) => (
                            <Form onSubmit={() => { const result = handleSubmit(); if (result) result.then(() => form.reset()); }}>
                                <Field name="body">
                                    {({ input, meta }) => (
                                        <Form.Field error={meta.touched && !!meta.error}>
                                            <input {...input} type="text" placeholder="Add your comment" />
                                            {meta.touched && meta.error && <Label basic color='red'>{meta.error}</Label>}
                                        </Form.Field>
                                    )}
                                </Field>
                                <Button
                                    content='Add Reply'
                                    labelPosition='left'
                                    icon='edit'
                                    primary
                                    loading={submitting}
                                />
                            </Form>
                        )}
                    />
                </Comment.Group>
            </Segment>
        </Fragment>
    )
}

export default observer(ActivityDetailedChat)
