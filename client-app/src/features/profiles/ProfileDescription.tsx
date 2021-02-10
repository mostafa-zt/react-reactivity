import React, { useContext, useState } from 'react'
import { Button, Grid, Header, Tab } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileEditForm from './ProfileEditForm';

const ProfileDescription = () => {
    const rootStore = useContext(RootStoreContext);
    const { profile, upadteProfile, isCurrentUser } = rootStore.profileStore;
    const [editMode, setEditMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile!.username}`} />
                    {isCurrentUser && (
                        <Button floated='right' basic content={editMode ? 'Cancel' : 'Edit Profile'} onClick={() => setEditMode(!editMode)} />
                    )}
                </Grid.Column>
                <Grid.Column width={16} className='profile_bio'>
                    {
                        editMode ? (
                            <ProfileEditForm updateProfile={upadteProfile} profile={profile!} setEditMode={setEditMode} />
                        ) : (<span>{profile!.bio}</span>)
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default ProfileDescription
