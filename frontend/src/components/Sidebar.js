import React from 'react';
import MuiList from '@mui/material/List';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {styled, Drawer, Divider, IconButton} from "@mui/material";

import AuthContext from "../context/AuthContext";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./Sidebar.css";
import {SidebarData} from './SidebarData';
import SubMenu from './SubMenu';

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

// White theme
// const List = styled(MuiList)({
//   '&& .Mui-selected, && .Mui-selected:hover': {
//     backgroundColor: 'red',
//     '&, & .MuiListItemIcon-root': {
//       color: 'pink',
//     },
//   },
//   '& .MuiListItemButton-root:hover': {
//     backgroundColor: 'orange',
//     '&, & .MuiListItemIcon-root': {
//       color: 'yellow',
//     },
//   },
// });



export default function Sidebar({open, theme, DrawerHeader, drawerWidth, handler, selectedIndex, handleListItemClick}) {
    let {user, logoutUser} = React.useContext(AuthContext)

    return (
        <>
            {user ? (
                    <Drawer sx={{width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': {width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#212529', color: 'white',} }}
                            variant="persistent" anchor="left" open={open}>
                        <DrawerHeader>
                            <IconButton onClick={handler} sx={{color:'white'}}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                            </IconButton>
                        </DrawerHeader>
                        <Divider sx={{background:'white'}}/>
                        <List>
                            {SidebarData.map((item, index) => {
                                return <SubMenu item={item} key={index} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>;
                            })}
                        </List>
                    </Drawer>
                ) : (
                <></>
                )}

        </>
    );
};