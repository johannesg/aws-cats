import * as React from 'react'

import { useMeQuery, useGetRandomCatsQuery } from '../apollo/types'

import { ImageList, ImageListItem, ListSubheader, Button, Typography } from '@mui/material'
import { AuthContext } from '../components/AuthProvider';
import { useContext } from 'react';

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

    return (<ImageList cellHeight={160} cols={3}>
        <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">Here are your stupid cats</ListSubheader>
        </ImageListItem>
        <ImageListItem key="Subheader" cols={1} style={{ height: 'auto' }}>
          <Button color="primary" onClick={() => refetch()}>Give me some new cats</Button>
        </ImageListItem>
        {data?.cats?.random?.map(cat => (
            <ImageListItem key={cat?.id} cols={1}>
                <img src={cat?.url} />
            </ImageListItem>))}
        </ImageList>)
}

export default function App() {
    const authInfo = useContext(AuthContext);
    return <div>
        {/* <Me /> */}
        <Typography variant="h5" align="center" component="h1" gutterBottom>
          Hello {authInfo.user.username}
        </Typography>
        <RandomCat />
    </div>;
}