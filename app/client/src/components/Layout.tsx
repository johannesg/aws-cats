import * as React from 'react'
import { useEffect, useState } from 'react';
import { Button, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AppBar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { logout, subscribeToUser, UserInfo } from '../auth';
import NotLoggedIn from '../components/Layout/NotLoggedIn';

type LayoutProps = {
    title: string
    children: React.ReactNode
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


function Profile({ user }: { user?: UserInfo }) {
    if (!user)
        return <NotLoggedIn/>
    else
        return <Button color="inherit" onClick={() => logout()}>Logout</Button>
}

export default ({ title, children }: LayoutProps) => {
    const classes = useStyles();
    const [user, setUser] = useState<UserInfo | undefined>();

    useEffect(() => {
        return subscribeToUser(({ user }) =>  {
                setUser(user);
        });
    }, []);

    return (
        <Grid container>
            <Grid item xs={12}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            size="large">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                        <Profile user={user}/>
                    </Toolbar>
                </AppBar>
            </Grid>
            <Grid item xs={false} sm={2} />
            <Grid item container xs={12} sm={8}>
                {children}
            </Grid>
            <Grid item xs={false} sm={2} />
        </Grid>
    );
}