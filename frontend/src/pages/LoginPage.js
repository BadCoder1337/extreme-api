import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useContext} from "react";
import AuthContext from "../context/AuthContext";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Великолепный сайт
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

export default function LoginPage() {
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const data = new FormData(event.currentTarget);
    //     console.log({
    //         email: data.get('email'),
    //         password: data.get('password'),
    //     });
    // };
    let {loginUser} = useContext(AuthContext)

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{height: '100vh'}}>
                <CssBaseline/>
                <Grid xs={false} sm={4} md={6}
                    sx={{
                        backgroundImage: 'url(https://sun9-88.userapi.com/impg/Fna9RT8x9g9qE2OnRzN2mPAN_jWmyR_cyh1NlQ/Nr5VLrSZELs.jpg?size=1147x1150&quality=96&sign=de041a77a758f7715fb821c3dbacb47e&c_uniq_tag=I3ecmZLkzv0AAcG7MHJlARsAEp61_X29KujSVtRET-s&type=album)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid xs={12} sm={8} md={6} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5" align={"center"}>
                            Войти в замечательную систему
                        </Typography>
                        {/*<Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>*/}
                        <Box component="form" noValidate onSubmit={loginUser} sx={{mt: 1}}>
                            <TextField
                                margin="normal" required fullWidth id="username"
                                label="Ваше имя пользователя" name="username"
                                autoComplete="username" autoFocus
                            />
                            <TextField
                                margin="normal" required fullWidth name="password"
                                label="Ваш пароль" type="password" id="password"
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox id="remember" color="primary"/>}
                                label="Запомнить меня"
                            />
                            <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                                Войти
                            </Button>
                            <Grid container>
                                <Grid xs={6}>
                                    <Link href="#" variant="body2">
                                        Забыли пароль?
                                    </Link>
                                </Grid>
                                <Grid xs={6}>
                                    <Link href="#" variant="body2">
                                        {"Нет аккаунта? Зарегистрируйтесь!"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{mt: 5}}/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
