import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import Navbar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loading from './Loading';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

const App: React.FC<RouteComponentProps> = ({ location }) => {
    const rootStore = useContext(RootStoreContext);
    const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
    const { getUser } = rootStore.userStore;

    useEffect(() => {
        if (token) {
            getUser().finally(() => setAppLoaded());
        } else {
            setAppLoaded()
        }
    }, [getUser, setAppLoaded, token])

    if (!appLoaded) return (<Loading content='App is loading...' />)

    return (
        <Fragment>
            <ModalContainer />
            <ToastContainer position='bottom-right' />
            <Route exact path='/' component={HomePage} />
            <Route path={'/(.+)'} render={() => (
                <Fragment>
                    <Navbar />
                    <Container style={{ marginTop: '7em'  }}>
                        <Switch>
                            <PrivateRoute exact path='/activities' component={ActivityDashboard} />
                            <PrivateRoute path='/activities/:id' component={ActivityDetails} />
                            <PrivateRoute key={location.key} path={['/create-activity', '/manage/:id']} component={ActivityForm} />
                            <PrivateRoute path='/profile/:username' component={ProfilePage} />
                            <Route component={NotFound} />
                        </Switch>
                    </Container>
                </Fragment>
            )} />
        </Fragment>
    )
}

export default withRouter(observer(App))
