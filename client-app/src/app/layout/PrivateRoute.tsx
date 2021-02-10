import React, { useContext } from 'react'
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom'
import { RootStoreContext } from '../stores/rootStore'

interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>>
}

const PrivateRoute: React.FC<IProps> = ({ component: Component, ...rest }) => {
    const rootStore = useContext(RootStoreContext);
    const { isLoggedIn } = rootStore.userStore;

    return (
        <Route {...rest} render={(porps) => isLoggedIn ? <Component {...porps} /> : <Redirect to={'/'} />} />
    )
}

export default PrivateRoute
