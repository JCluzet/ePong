import React from 'react';
import { ReactComponent as Logo } from '../assets/images/logo.svg';
import '../styles/header.css';

const Header = () => {

    // state

    // comportements

    // affichage

    return(
        <nav>
            <div className="container">
                <div className='div-header'>
                    <div className='logo-header'>
                        <Logo height="50px" />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header;