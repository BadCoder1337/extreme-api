import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';

const NavMenu = ({item}) => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const [width, setWidth] = React.useState(window.innerWidth);

    return (
        <>
            <li className="nav-item">
                <NavLink to={item.path} id={item.id}
                         className={({isActive}) => "nav-links" + (isActive ? " activated" : "")}
                         onClick={closeMobileMenu} style={{maxWidth: width}}>
                    {item.icon}
                    <span style={{marginLeft: '16px'}}>{item.title}</span>
                </NavLink>
            </li>

        </>
    );
};

export default NavMenu;
