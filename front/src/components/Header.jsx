import React from 'react';
// import { ReactComponent as Home } from '../assets/images/headerLogo.svg';
import { ReactComponent as Logo } from '../assets/images/logo.svg';
// import { NavLink } from 'react-router-dom';
import '../styles/header.css';
// import React from 'react'
import { Button } from 'semantic-ui-react'

const Header = () => {

    // state

    // comportements

    // affichage

    return(
        <nav>
            <div className='div-header'>
                <div className='logo-header'>
                    <Logo width="200px" height="50px" />
                </div>
                <div>
                    {/* <NavLink to='/'><Home/></NavLink> */}
                    <Button>Login</Button>
                </div>
            </div>
        </nav>
    )
}

export default Header;