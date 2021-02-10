import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSideBar from './ActivityDetailedSideBar';
import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityDetailsPlaceHolder from './ActivityDetailsPlaceHolder';

interface MatchParams {
    id: string
}
const ActivityDetails: React.FC<RouteComponentProps<MatchParams>> = ({ match, history }) => {
    const rootStore = useContext(RootStoreContext)
    const { selectedActivity, loadActivity, loadingInitial } = rootStore.activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match])

    if (loadingInitial || !selectedActivity)
        return <ActivityDetailsPlaceHolder />
        
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={selectedActivity} />
                <ActivityDetailedInfo activity={selectedActivity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSideBar attendees={selectedActivity.attendees} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDetails)
