import { Container, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import * as React from 'react'
import Layout from '../components/Layout'

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 5,
        textAlign: "center"
    }
}));

export default () => {
    const classes = useStyles();
    return <Layout title="About">
        <Container className={classes.container}>
            <Typography variant="h3">This is about cats</Typography>
        </Container>
    </Layout>
}