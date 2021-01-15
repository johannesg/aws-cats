import * as React from 'react'
import { useState, useEffect, useContext } from "react"

import AuthProvider, { AuthContext } from '../components/AuthProvider';
import Layout from '../components/Layout'

import { useMeQuery, useGetRandomCatsQuery, Cat, Maybe } from '../apollo/types'

import { GridList, GridListTile, ListSubheader, Button, Typography, Grid, Card, makeStyles, CardMedia, CardHeader, CardActions, IconButton, CardContent, Box, LinearProgress } from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import catList from '../cats';
import { green, red } from '@material-ui/core/colors';
import { NetworkStatus } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  header: {
    margin: theme.spacing(1)

  },
  actions: {
    margin: theme.spacing(1)
  },
  card: {
    margin: theme.spacing(1)
  },
  progress: {
    margin: theme.spacing(1)
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  favourite: {
    color: red[600]
  },
  thumbUp: {
    color: green[600]
  },
  thumbDown: {
    color: red[600]
  },
}));

function Header() {
  const authInfo = useContext(AuthContext);
  const classes = useStyles();

  const { loading, error, data } = useMeQuery();

  let username = authInfo.user.username;


  if (!loading && data?.me?.id)
    username = data?.me?.id;

  return <Typography className={classes.header} variant="h5" align="center" component="h1" gutterBottom>
    Hello {username}. Here's some cats
   </Typography>

  // return <Typography className={classes.header} variant="h5" align="center" component="h1" gutterBottom>
  //   Hello {username}. Here's some cats
  // </Typography>
}

function CatCard({ item }: { item: Maybe<Cat> }) {
  const classes = useStyles();

  return <Card className={classes.card}>
    {/* <CardHeader title="Some Cat"></CardHeader> */}
    <CardMedia
      className={classes.media}
      image={item.url}
      title="Paella dish"
    />
    <CardActions>
      <IconButton className={classes.favourite}>
        <FavoriteIcon />
      </IconButton>
      <IconButton className={classes.thumbUp}>
        <ThumbUpIcon />
      </IconButton>
      <IconButton className={classes.thumbDown}>
        <ThumbDownIcon />
      </IconButton>
    </CardActions>
  </Card>
}

function App() {
  const classes = useStyles();

  const { loading, error, data, refetch, networkStatus } = useGetRandomCatsQuery({ 
    variables: { pageSize: 9 },
    notifyOnNetworkStatusChange: true 
   });

  return <Grid container>
    <Grid item xs={12}><Header /></Grid>
    <Grid item xs={12}>
      <Box className={classes.actions}>
        <Button variant="contained" color="primary" onClick={() => refetch()}>Give me some other cats</Button>
      </Box>
    </Grid>
    {
      loading
      ? <Grid item xs={12}><LinearProgress className={classes.progress} /></Grid>
      : null
    }
    {
      (loading && networkStatus !== NetworkStatus.refetch)
      ? <Grid item xs={12}></Grid>
      : data?.cats?.random?.map(cat => <Grid key={cat?.id} item xs={12} sm={4}><CatCard item={cat} /></Grid>)
    }
  </Grid>
}

export default function Index() {
  return (
    <Layout title="Cats V2">
      <AuthProvider>
        <App />
      </AuthProvider>
    </Layout>
  );
}