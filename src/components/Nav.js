import React from 'react';
import { Link } from 'react-router-dom';
import myLogo from '../../src/images/myLogo.png';

function Nav() {
  return (
    <nav>
      <ul>
        <li className='logo-icon'>
          <img src={myLogo} alt="Logo" className='stock-screener-logo' />
        </li>
        <Link to="/">
          <li id="home">Screener</li>
        </Link>
        <Link to="/details">
          <li id="details">Stock Details</li>
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;
