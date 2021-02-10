import React from 'react'
import { Grid, List, Placeholder, Segment } from 'semantic-ui-react'

const ProfilePagePlaceHolder = () => {
    return (
        <Grid>
            <Grid.Column width={16}>
                <Segment>
                    <Grid>
                        <Grid.Column width={12}>
                            <Placeholder>
                                <Placeholder.Header image   >
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                            </Placeholder>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Placeholder>
                                <Placeholder.Image rectangular />
                            </Placeholder>
                            <Placeholder>
                                <Placeholder.Paragraph >
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Placeholder>
                                <Placeholder.Image rectangular />
                            </Placeholder>
                            <Placeholder>
                                <Placeholder.Paragraph >
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>

                        </Grid.Column>
                    </Grid>
                </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
                <Segment>
                    <Grid>
                        <Grid.Column width={16} style={{ height: '250px' }} >
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                            </Placeholder>
                            <Placeholder>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Grid.Column>
            <Grid.Column width={6}>
                <Segment attached>
                    <List relaxed divided>
                        <Placeholder>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </List>
                    <List relaxed divided>
                        <Placeholder>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </List>
                    <List relaxed divided>
                        <Placeholder>
                            <Placeholder.Paragraph >
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </List>
                    <List relaxed divided>
                        <Placeholder>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </List>
                    <List relaxed divided>
                        <Placeholder>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </List>
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default ProfilePagePlaceHolder
