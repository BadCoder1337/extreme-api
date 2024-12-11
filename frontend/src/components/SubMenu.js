import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {Collapse, List} from "@mui/material";
import "./SubMenu.css";

const SubMenu = ({item, selectedIndex, handleListItemClick}) => {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <ListItem button key={item.title} disablePadding component={Link} to={item.path}
                      onClick={item.subNav && showSubnav} id={item.id}>
                <ListItemButton selected={selectedIndex === item.id} onClick={() => handleListItemClick(item.id)}>
                    <ListItemIcon sx={{color: 'white'}}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title}/>
                </ListItemButton>
                <div>
                    {item.subNav && subnav
                        ? item.iconOpened
                        : item.subNav
                            ? item.iconClosed
                            : null
                    }
                </div>
                {/*{item.subNav &&*/}
                {/*    <ListItemButton role={undefined}>*/}
                {/*        <ListItemIcon>*/}
                {/*            {item.subNav && subnav*/}
                {/*                ? item.iconOpened*/}
                {/*                : item.subNav*/}
                {/*                    ? item.iconClosed*/}
                {/*                    : null*/}
                {/*            }*/}
                {/*        </ListItemIcon>*/}
                {/*    </ListItemButton>*/}
                {/*}*/}
            </ListItem>
            {subnav &&
                item.subNav.map((item, index) => {
                    return (
                        <Collapse in={subnav} timeout="auto" unmountOnExit sx={{pl: 4}}>
                            <List component="div" disablePadding>
                                <ListItem button key={item.title} disablePadding component={Link} to={item.path}
                                          onClick={item.subNav && showSubnav} id={item.id}>
                                    <ListItemButton selected={selectedIndex === item.id}
                                                    onClick={() => handleListItemClick(item.id)}>
                                        <ListItemIcon sx={{color: 'white'}}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.title}/>
                                    </ListItemButton>
                                    <div>
                                        {item.subNav && subnav
                                            ? item.iconOpened
                                            : item.subNav
                                                ? item.iconClosed
                                                : null
                                        }
                                    </div>
                                </ListItem>
                            </List>
                        </Collapse>
                    );
                })
            }
        </>
    );
};

export default SubMenu;
