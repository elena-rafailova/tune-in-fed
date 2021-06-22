import React from 'react';

import './Footer.scss';
import FacebookIcon from '../../assets/icons/facebook.png';
import PhoneIcon from '../../assets/icons/phone.png';
import InstagramIcon from '../../assets/icons/instagram.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div>&copy; 2021 Elena Rafailova - All rights reserved.</div>
            <div className="center">
                <span>Connect with us</span>&nbsp;
                <a href="http://facebook.com/" target="_blank" rel="noreferrer">
                    <img src={FacebookIcon} alt="facebook" />
                </a>
                <a
                    href="http://instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src={InstagramIcon} alt="instagram" />
                </a>
                <a href="tel:0888-11-22-33">
                    <img src={PhoneIcon} alt="phone" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
