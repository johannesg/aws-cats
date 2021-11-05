import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { login } from '../../auth';
import { makeStyles } from '@mui/styles';
import { Checkbox, FormControlLabel, Grid, Link, Theme, Typography } from '@mui/material';
import { Controller, useForm } from "react-hook-form";


const useStyles = makeStyles<Theme>((theme) => ({
    form: {
        // marginTop: theme.spacing(0),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

type InputCredentials = {
    username: string
    password: string
    remember: boolean
};

export default function NotLoggedIn() {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogin = ({ username, password, remember }: InputCredentials) => {
        setOpen(false);
        login(username, password);
    }

    const { register, handleSubmit, control } = useForm<InputCredentials>();

    return (
        <div>
            <Button color="inherit" onClick={handleClickOpen}>Login</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Sign in
                </DialogTitle>
                <DialogContent>
                    <form className={classes.form} onSubmit={handleSubmit(handleLogin)} >
                        <Controller
                            name="username"
                            control={control}
                            defaultValue={""}
                            render={({ field }) => <TextField
                                autoFocus
                                variant="outlined"
                                required
                                margin="normal"
                                label="Username"
                                fullWidth
                                {...field}
                            />}
                        />
                        <Controller
                            name="password"
                            control={control}
                            defaultValue={""}
                            render={({ field }) => <TextField
                                variant="outlined"
                                required
                                margin="normal"
                                label="Password"
                                type="password"
                                fullWidth
                                {...field}
                            />}
                        />

                        <Controller
                            name="remember" 
                            control={control}
                            defaultValue={false}
                            render={({ field }) => <FormControlLabel
                                control={<Checkbox color="primary" {...field} />}
                                label="Remember me"
                            />}
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