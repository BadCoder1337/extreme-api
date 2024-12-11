import {Routes, Route, Navigate, useLocation} from "react-router-dom";
import React from "react";
import {IconButton, styled, useTheme, Box, CssBaseline} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import './App.css';
import PrivateRoute from './utils/PrivateRoute'
import AuthContext from './context/AuthContext'
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage'
import Profile from './pages/Profile';

const usePrevious = (value) => {
    const ref = React.useRef()
    React.useEffect(() => {
        ref.current = value.replaceAll('/', '');
    })
    return ref.current
}

const themeLight = createTheme({
    palette: {
        background: {
            default: "#f3f6f9"
        },
        text: {
            primary: "black"
        }
    }
});

const themeDark = createTheme({
    palette: {
        background: {
            default: "#222222"
        },
        text: {
            primary: "#ffffff"
        }
    }
});

export default function App() {
    let {user} = React.useContext(AuthContext)
    const theme = useTheme();
    const [light, setLight] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [width, setWidth] = React.useState(0)
    const [height, setHeight] = React.useState(0)

    let updateDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    React.useEffect(() => {
        updateDimensions();
        window.addEventListener('resize', updateDimensions)
    }, []);

    React.useEffect(() => {
        return () => {
            window.removeEventListener('resize', updateDimensions)
        }
    }, []);

    function handler(open) {
        setOpen(!open)
    }

    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    const drawerWidth = 240;

    const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(
        ({theme, open}) => ({
            flexGrow: 1,
            padding: theme.spacing(0),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `-${drawerWidth}px`,
            ...(((!user) || (width < 1080)) && {
                marginLeft: 0,
            }),
            ...(open && {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            }),
        }),
    );

    const location = useLocation().pathname.replaceAll('/', '');
    const prevLocation = usePrevious(location);
    const [selectedIndex, setSelectedIndex] = React.useState(location);

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };
    const LocationChange = (location, prevLocation) => {
        React.useEffect(() => {
            if (prevLocation !== undefined) {
                if (prevLocation !== location) {
                    console.log('changed from', prevLocation, 'to', location)
                    setSelectedIndex(location)
                }
            }
        }, [location, prevLocation])
    }

    LocationChange(location, prevLocation);

    document.querySelector("meta[name='viewport']").setAttribute('content',
        'width=device-width, height=device-height, initial-scale=1')

    return (
        <ThemeProvider theme={light ? themeLight : themeDark}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <Navbar open={open} handler={handler} drawerWidth={drawerWidth} width={width}
                        selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>

                {width < 1080 ? <></> :
                    <Sidebar open={open} theme={theme} DrawerHeader={DrawerHeader} drawerWidth={drawerWidth}
                             handler={handler} selectedIndex={selectedIndex}
                             handleListItemClick={handleListItemClick}/>}
                <Main open={open}>
                    {user ? <DrawerHeader/> : <></>}
                    <Routes>
                        <Route path='/' element={<PrivateRoute/>}>
                            <Route path='/profile' element={<Profile height={height - 80}/>}/>
                        </Route>
                        <Route path='/' element={<PrivateRoute/>}>
                            <Route path='/schedule' element={<Profile height={height - 80}/>}/>
                        </Route>
                        {/*<Route exact path='/register' element={<Register/>}/>*/}
                        <Route path='/login' element={user ? <Navigate to="/profile" replace/> : <LoginPage/>}/>
                        <Route path="*" element={<Navigate to="/profile" replace/>}/>
                    </Routes>
                </Main>
            </Box>
        </ThemeProvider>
    );
}

// class App extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             sidebar: 0,
//             width: 0,
//             height: 0,
//         };
//     }
//
//     updateDimensions = () => {
//         this.setState({width: window.innerWidth, height: window.innerHeight});
//     };
//
//     componentDidMount() {
//         this.updateDimensions();
//         window.addEventListener('resize', this.updateDimensions);
//     }
//
//     componentWillUnmount() {
//         window.removeEventListener('resize', this.updateDimensions);
//     }
//
//     handler = (sidebar) => {
//         this.setState({sidebar: !sidebar})
//     }
//
//     render() {
//         let aside = this.state.width < 1080 ? <></> : <Sidebar sidebar={this.state.sidebar}/>;
//         return (
//             <Router>
//                 <AuthProvider>
//                     <div className="flex-container">
//                         <div className="item1">
//                             {aside}
//                         </div>
//                         <div className="item2">
//                             <Navbar sidebar={this.state.sidebar} handler={this.handler}/>
//                             <Routes>
//                                 <Route path='/' element={<PrivateRoute/>}>
//                                     <Route path='/profile' element={<Profile/>}/>
//                                 </Route>
//                                 {/*<Route exact path='/register' element={<Register/>}/>*/}
//                                 <Route path='/login' element={<LoginPage/>}/>
//                                 <Route path="*" element={<Navigate to="/profile" replace />} />
//                             </Routes>
//                         </div>
//                     </div>
//                 </AuthProvider>
//             </Router>
//         );
//     }
// }
//
// export default App;
