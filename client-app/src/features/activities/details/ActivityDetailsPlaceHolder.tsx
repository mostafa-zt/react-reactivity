import React from 'react'
import { Grid, Placeholder, Segment, Button, Icon, List, Header } from 'semantic-ui-react';

const ActivityDetailsPlaceHolder = () => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment.Group>
                    <Segment basic attached='top' style={{ padding: '0' }}>
                        <Placeholder fluid >
                            <Placeholder.Header style={{ height: '15rem' }} >
                                <Placeholder.Image rectangular />
                            </Placeholder.Header>
                            <Segment clearing attached='bottom'>
                                <Button disabled={true} color='orange' floated='right'>Manage Event</Button>
                            </Segment>
                        </Placeholder>
                    </Segment>
                </Segment.Group>
                <Segment.Group>
                    <Segment attached='top'>
                        <Grid>
                            <Grid.Column width={1}>
                                <Icon size='large' color='teal' name='info' />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Placeholder>
                                    <Placeholder.Paragraph>
                                        <Placeholder.Line length='medium' />
                                        <Placeholder.Line length='medium' />
                                    </Placeholder.Paragraph>
                                </Placeholder>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment attached>
                        <Grid verticalAlign='middle'>
                            <Grid.Column width={1}>
                                <Icon name='calendar' size='large' color='teal' />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Placeholder>
                                    <Placeholder.Paragraph>
                                        <Placeholder.Line length='medium' />
                                        <Placeholder.Line length='medium' />
                                    </Placeholder.Paragraph>
                                </Placeholder>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment attached>
                        <Grid verticalAlign='middle'>
                            <Grid.Column width={1}>
                                <Icon name='marker' size='large' color='teal' />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Placeholder>
                                    <Placeholder.Paragraph>
                                        <Placeholder.Line length='medium' />
                                        <Placeholder.Line length='medium' />
                                    </Placeholder.Paragraph>
                                </Placeholder>
                            </Grid.Column>
                        </Grid>
                    </Segment>
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
                        <List relaxed divided>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                            </Placeholder>
                        </List>
                        <List relaxed divided>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                            </Placeholder>
                        </List>
                        <List relaxed divided>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                            </Placeholder>
                        </List>
                        <Button content='Add Reply' labelPosition='left' icon='edit' primary disabled={true} />
                    </Segment>
                </Segment.Group>
            </Grid.Column>
            <Grid.Column width={6}>
                <Segment
                    textAlign='center'
                    style={{ border: 'none' }}
                    attached='top'
                    secondary
                    inverted
                    color='teal'
                >
                </Segment>
                <Segment attached>
                    <List relaxed divided>
                        <Placeholder>
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                        </Placeholder>
                    </List>
                    <List relaxed divided>
                        <Placeholder>
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                        </Placeholder>
                    </List>
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default ActivityDetailsPlaceHolder
