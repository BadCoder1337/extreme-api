import React from "react";
import Typography from "@mui/material/Typography";
import {Collapse, IconButton, styled, Toolbar, useScrollTrigger} from "@mui/material";
import MuiList from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import SubMenu from "./SubMenu";
import "./Navbar.css";
import AuthContext from '../context/AuthContext'
import {SidebarData} from "./SidebarData";

// Black theme
const List = styled(MuiList)({
  // selected и (selected + hover)
  '&& .Mui-selected, && .Mui-selected:hover': {
    backgroundColor: 'blue',
    '&, & .MuiListItemIcon-root': {
      color: 'white',
    },
  },
  // hover
  '& .MuiListItemButton-root:hover': {
    backgroundColor: '#632ce4',
    '&, & .MuiListItemIcon-root': {
      color: 'white',
    },
  },
});

function Navbar({open, handler, drawerWidth, theme, selectedIndex, handleListItemClick, width}) {
    let {user, logoutUser} = React.useContext(AuthContext)
    const {authTokens} = React.useContext(AuthContext);
    const [greeting, setGreeting] = React.useState(null);
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window : undefined,
    });

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({theme, open}) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen,
        }),
        ...(((open) && (width > 1080)) && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut, duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    function returnGreeting(name) {
        // ToDo а надо ли время?
        if ((name === undefined) || (name === null))
            name = 'Пользователь'
        if ((new Date().getHours() >= 4) && (new Date().getHours() < 12))
            // return ('Доброе утро, ' + name + '! Ваше текущее время - ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, "0"))
            return ('Доброе утро, ' + name + '!')
        else if ((new Date().getHours() >= 12) && (new Date().getHours() < 17))
            // return ('Добрый день, ' + name + '! Ваше текущее время - ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, "0"))
            return ('Добрый день, ' + name + '!')
        else if ((new Date().getHours() >= 17) && (new Date().getHours() < 24))
            // return ('Добрый вечер, ' + name + '! Ваше текущее время - ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, "0"))
            return ('Добрый вечер, ' + name + '!')
        else
            // return ('Доброй ночи, ' + name + '! Ваше текущее время - ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, "0"))
            return ('Доброй ночи, ' + name + '!')
    }

    async function getUsername() {
        try {
            const response = await fetch('http://localhost/api/profile/get_profile/?profile=' + user.auth_user, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens)
                }
            });
            if (response.status === 200) {
                // console.log(response)
                let data = await response.json()
                try {
                    setGreeting(returnGreeting(data.student_name))

                } catch (e) {
                    setGreeting(returnGreeting(data.teacher_name))
                }
            } else if (response.statusText === 'Unauthorized') {
                logoutUser()
            } else {
                throw new Error("Ответ сети был не ok.");
            }
        } catch (error) {
            console.log("Возникла проблема с вашим fetch запросом: ", error.message);
        }
    }

    React.useEffect(() => {
        getUsername();
    }, [user]);

    if (width < 1080) {
        return (
            <>
                {user ? (
                    <AppBar position="fixed" open={open} sx={{backgroundColor: '#212529'}} elevation={trigger ? 4 : 0}>
                        <Toolbar>
                            <IconButton color="inherit" aria-label="open drawer" onClick={() => handler(open)}
                                        edge="start" sx={{mr: 2,}}>
                                {/*...(open && {display: 'none'})*/}
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                {greeting}
                            </Typography>
                            <IconButton color="inherit" aria-label="logout" onClick={logoutUser} edge="end">
                                <ExitToAppIcon/>
                            </IconButton>
                        </Toolbar>
                        <Collapse in={open} direction='left' timeout={2000}>
                            <List sx={{overflow: 'auto', height: window.innerHeight - 48}}>
                                {SidebarData.map((item, index) => {
                                    return <SubMenu item={item} key={index} selectedIndex={selectedIndex}
                                                    handleListItemClick={handleListItemClick}/>;
                                })}
                            </List>

                        </Collapse>
                    </AppBar>
                ) : (
                    <></>
                )}
            </>
        );
    } else {
        return (
            <>
                {user ? (
                    <AppBar position="fixed" open={open} sx={{backgroundColor: '#212529'}} elevation={trigger ? 8 : 0}>
                        <Toolbar>
                            <IconButton color="inherit" aria-label="open drawer" onClick={() => handler(open)}
                                        edge="start" sx={{mr: 2,}}>
                                {/*...(open && {display: 'none'})*/}
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                {greeting}
                            </Typography>
                            <IconButton color="inherit" aria-label="logout" onClick={logoutUser} edge="end">
                                <ExitToAppIcon/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                ) : (
                    <></>
                )}
            </>
        );
    }
}


export default Navbar;