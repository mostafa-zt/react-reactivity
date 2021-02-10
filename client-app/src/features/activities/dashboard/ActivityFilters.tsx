import React, { Fragment, useContext } from 'react';
import { Menu, Header, Sticky } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

interface IProps {
    contextRef: React.MutableRefObject<null>
}

const ActivityFilters:React.FC<IProps> = ({contextRef}) => {
    const rootStore = useContext(RootStoreContext);
    const { predicate, setPredicate } = rootStore.activityStore;

    return (
        <Fragment>
            <Sticky context={contextRef} styleElement={{ marginTop: 10,zIndex: 1}}>
                <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
                    <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
                    <Menu.Item active={predicate.size === 0} onClick={() => setPredicate('all', 'true')} color={'blue'} name={'all'} content={'All Activities'} />
                    <Menu.Item active={predicate.has('isGoing')} onClick={() => setPredicate('isGoing', 'true')} color={'blue'} name={'username'} content={"I'm Going"} />
                    <Menu.Item active={predicate.has('isHost')} onClick={() => setPredicate('isHost', 'true')} color={'blue'} name={'host'} content={"I'm hosting"} />
                </Menu>
                <Header icon={'calendar'} attached color={'teal'} content={'Select Date'} />
                <Calendar onChange={(date) => setPredicate('startDate', date!)} value={predicate.get('startDate') || new Date()} />
            </Sticky>
        </Fragment>
    )
};

export default observer(ActivityFilters);