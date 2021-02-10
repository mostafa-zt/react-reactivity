import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';
import ProfilePagePlaceHolder from './ProfilePagePlaceHolder';

interface RouteParams {
    username: string;
}

interface IProps extends RouteComponentProps<RouteParams> { }

const ProfilePage: React.FC<IProps> = ({ match }) => {
    const rootStore = useContext(RootStoreContext);
    const { loadProfile, loadingProfile, profile, follow, unfollow, isCurrentUser, loading , setActiveTab } = rootStore.profileStore;

    useEffect(() => {
        loadProfile(match.params.username)
    }, [loadProfile, match.params.username])

    if (loadingProfile) return <ProfilePagePlaceHolder />

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!} follow={follow} unfollow={unfollow} isCurrentUser={isCurrentUser} loading={loading} />
                <ProfileContent setActiveTab={setActiveTab} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ProfilePage)
