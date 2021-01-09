import * as React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { login } from '../../auth';
import { makeStyles } from '@material-ui/styles';
import { Checkbox, FormControlLabel, Grid, Link, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles<Theme>((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function NotLoggedIn() {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogin = (event: any) => {
        event.preventDefault();
        setOpen(false);
    }

    return (
        <div>
            <Button color="inherit" onClick={handleClickOpen}>Login</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"><Typography component="h1" variant="h5">
                    Sign in
        </Typography></DialogTitle>
                <DialogContent>
                    <form className={classes.form} onSubmit={handleLogin} >
                        <TextField
                            autoFocus
                            variant="outlined"
                            required
                            margin="normal"
                            id="username"
                            label="Username"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            variant="outlined"
                            required
                            margin="normal"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
          </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
              </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}