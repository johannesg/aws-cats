import * as React from 'react'
import { useEffect, useState } from 'react';
import { Button, Grid, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core'
import { AppBar } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { Auth, CognitoUser } from '@aws-amplify/auth'

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

function Profile({ user }: { user?: CognitoUser }) {
    if (!user)
        return <Button color="inherit">Login</Button>
    else
        return <Button color="inherit" onClick={() => Auth.signOut()}>Logout</Button>
}

export default ({ title, children }: LayoutProps) => {
    const classes = useStyles();
    const [user, setUser] = useState<CognitoUser>();

    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then((user: CognitoUser) => {
                console.log(`Logged in as ${user.getUsername()}`);
                setUser(user);
            })
            .catch(err => {
                console.log("Not logged in");
            })
    }, []);

    return <Grid container>
        <Grid item xs={12}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    <Profile user={user}/>
                </Toolbar>
            </AppBar>
        </Grid>
        <Grid item container xs={12}>
            {children}
        </Grid>
    </Grid>
}