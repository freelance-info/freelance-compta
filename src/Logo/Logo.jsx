import React from 'react';

import logoImage from './logo.png';
import classes from './Logo.module.css';

const Logo = (props) => (
    <div className={classes.Logo} onClick={props.clicked}>
        <img src={logoImage} alt="Logo" />
    </div>
);

export default Logo;
