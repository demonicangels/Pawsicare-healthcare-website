import { NavLink } from 'react-router-dom';
import '../css/Navbar.css'
import DarkModeToggle from "react-dark-mode-toggle";
import React, { useState } from 'react';
import TokenService from '../services/TokenService';

const links = [
    {
        id: 1,
        path: '/',
        text: "Home"
    },
    {
        id: 2,
        path: '/doctors',
        text: "Doctors"
    },
    {
        id: 3,
        path: '/aboutus',
        text: "About us"
    },
    {
        id: 4,
        path: '/contacts',
        text: "Contacts"
    },
    {
        id: 5,
        path: '/appointments',
        text: "My appointments"
    }
]

const Navbar = ({isDarkMode,setIsDarkMode}) => {

    const isLoggedIn = TokenService.getAccessToken() !== null;

    let userRole = null;
    if(isLoggedIn){
        const claims = TokenService.getClaims();
        userRole = claims.role;
    }

    const navStyle = {
        background: isDarkMode ? 'white' : '#B7C9E2',
    };

    const liStyle = {
        color: isDarkMode ? 'black' : 'white',
        cursor: 'pointer'
    }

    return ( 
        <nav className="navbar">
            <div className="nav" style={navStyle}>
                <ul>
                    {links.map(link => {
                        return (
                            <li key={link.id}>
                                {
                                    <NavLink to={link.path} style={liStyle}>
                                        {link.text}
                                    </NavLink>
                                }
                            </li>
                        );
                    })}

                    { isLoggedIn !== null && userRole === 'Client' ? (
                        <React.Fragment>
                            <li>
                                <NavLink data-testid="cypress-openCreateDialog-mypetsPageLink" to="/mypets" style={liStyle}>
                                    My Pets 
                                </NavLink>
                            </li>
                        </React.Fragment> ) : null
                        
                    }
                </ul>
            </div>
        </nav>
     );
}

export default Navbar;