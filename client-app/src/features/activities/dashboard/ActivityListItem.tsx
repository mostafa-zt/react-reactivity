import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Item, Button, Label, Segment, Icon } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityListItemAttendees from './ActivityListItemAttendees';
import { observer } from 'mobx-react-lite';

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
    const rootStore = useContext(RootStoreContext);
    const { selectActivity, deleteActivity } = rootStore.activityStore;

    const host = activity.attendees.filter(x => x.isHost)[0];

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={host.image || '/assets/user.png'} style={{ marginBottom: 3 }} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`} >{activity.title}</Item.Header>
                            <Item.Description>Hosted By&nbsp;
                                <Link to={`/profile/${host.username}`}>
                                    {host.displayName}
                                </Link>
                            </Item.Description>
                            {activity.isHost &&
                                <Item.Description>
                                    <Label basic color='orange' content='You are hosting this activity'></Label>
                                    <Label basic content={activity.category.toUpperCase()}></Label>
                                </Item.Description>}
                            {activity.isGoing && !activity.isHost &&
                                <Item.Description>
                                    <Label basic color='green' content='You are going to this activity'></Label>
                                    <Label basic content={activity.category.toUpperCase()}></Label>
                                </Item.Description>}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attendence will go here
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} onClick={() => selectActivity(activity.id)} floated='right' content='View' color='blue' />
                <Button onClick={() => deleteActivity(activity.id)} floated='right' content='Delete' color='red' />
            </Segment>
        </Segment.Group>

    )
}

export default observer(ActivityListItem)
