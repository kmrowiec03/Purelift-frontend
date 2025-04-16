import React from "react";
import { Link } from 'react-router-dom';
import "/src/style/navigation.css"
const NavBar = () => {
    return (
        <nav className="Navbar">
            <div className="Toolbar_container_for_buttons Left-toolbar">
                <Link to="/articles" className="Toolbar_button">Articles</Link>
                <Link to="/trainingPlans" className="Toolbar_button">Training Plans</Link>
            </div>

            <Link to="/">
                <img src="/src/assets/logo.png"  alt={"logo"} className="NavLogo"/>
            </Link>

            <div className="Toolbar_container_for_buttons Right-toolbar">
            </div>
        </nav>
    );
};

export default NavBar;
