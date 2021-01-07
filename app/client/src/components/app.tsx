import * as React from 'react'

import { useMeQuery, useGetRandomCatsQuery, GetRandomCatsQuery } from '../apollo/types'

import { GridList, GridListTile, ListSubheader, Button, Typography } from '@material-ui/core'

function Me() {
    const { loading, error, data } = useMeQuery();

    if (loading)
        return <div>Loading user</div>;

    return <div>
        <div>Hello {data?.me?.id}</div>
    </div>
}




function RandomCat() {
    const { loading, error, data, refetch } = useGetRandomCatsQuery({ variables: { pageSize: 9 } });

    if (loading)
        return <Typography variant="subtitle1">Loading random cat</Typography>;

    return (<GridList cellHeight={160} cols={3}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">Here are your stupid cats</ListSubheader>
        </GridListTile>
        <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
          <Button color="primary" onClick={() => refetch()}>Give me some new cats</Button>
        </GridListTile>
        {data?.cats?.random?.map(cat => (
            <GridListTile key={cat?.id} cols={1}>
                <img src={cat?.url} />
            </GridListTile>))}
        </GridList>)
}

export default function App() {
    return <div>
        {/* <Me /> */}
        <RandomCat />
    </div>;
}