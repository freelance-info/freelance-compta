import React from 'react';
import logoImage from './logo.png';
import classes from './Logo.module.css';

const Logo = () => (
  <button type="button" className={classes.Logo}>
    <img src={logoImage} alt="Logo" />
  </button>
);

export default Logo;
