import React, {useContext, useEffect, useState} from 'react';
import AuthContext from '../context/AuthContext'
import {Card, Box, Paper, styled, Container} from "@mui/material";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const SquaredItem = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    aspectRatio: "1/1",
    display: "flex",
    justifyContent: "center",
    // alignItems: "center",
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const Profile = () => {
    const {authTokens, logoutUser} = useContext(AuthContext);
    let [profile, setProfile] = useState([])

    let url = null; // URL API для данных
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.profile !== null) {
        url = 'http://localhost/api/profile/get_profile/?profile=' + params.profile;
        // document.getElementById("change_profile").style.display = 'none';
        // document.querySelector(".btn-default").style.display = 'none';
    } else
        url = 'http://localhost/api/profile/get_profile/';

    useEffect(() => {
        getData()
    }, [])

    async function getData() {

        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens)
            }
        })
        let data = await response.json()
        console.log(data)
        if (response.status === 200) {
            setProfile(data)
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }

    return (
        // <Box height={height} display="flex" flexDirection="column" className="content">
        <Box display="flex" flexDirection="column" className="content">
            <Box flex={1} overflow="auto">
                <Container sx={{p: 3}} maxWidth={false} disableGutters>
                    <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        <Grid item xs={4}>
                            <SquaredItem>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                    sx={{width: 1/2, height: 1/2}}
                                />
                            </SquaredItem>
                        </Grid>
                        <Grid item xs={8}>
                            <Item>
                                <Grid container rowSpacing={{xs: 1, sm: 2, md: 3}}
                                      columnSpacing={{xs: 1, sm: 2, md: 3}}>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">1</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">11</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">1</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">11</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">1</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">11</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">1</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">11</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">1</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">11</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">1</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">11</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">1</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">11</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">1</Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card variant="outlined">11</Card>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item>3</Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item>4</Item>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>


    );
};

export default Profile;