import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Grid, Loader, Ref } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceholder from './ActivityListItemPlaceHolder';

const ActivityDashboard: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { loadActivities, loadingInitial, setPage, page, totalPages } = rootStore.activityStore;
    const [loadingNext, setLoadingNext] = useState(false);
    const contextRef = useRef(null);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPage(page + 1);
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    return (
        <Grid>
            <Grid.Column width='10'>
                {loadingInitial && page === 0 ?
                    <ActivityListItemPlaceholder />
                    :
                    <InfiniteScroll pageStart={0} loadMore={handleGetNext} hasMore={!loadingNext && page + 1 < totalPages} initialLoad={false}>
                        <ActivityList />
                    </InfiniteScroll>
                }
            </Grid.Column>
            <Ref innerRef={contextRef}>
                <Grid.Column width='6'>
                    <ActivityFilters contextRef={contextRef} />
                </Grid.Column>
            </Ref>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard)
