import React from "react";
import { Link } from 'react-router-dom';
import "/src/style/navigation.css";
import { useAuth } from "../actions/AuthContext.jsx";

const NavBar = () => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <nav className="Navbar">
            <div className="Toolbar_container_for_buttons Left-toolbar">
                <Link to="/articles" className="Toolbar_button">Articles</Link>
                {isLoggedIn && (
                    <Link to="/trainingPlans" className="Toolbar_button">Training Plans</Link>
                )}
            </div>

            <Link to="/">
                <img src="/src/assets/logo.png" alt="logo" className="NavLogo" />
            </Link>

            <div className="Toolbar_container_for_buttons Right-toolbar">
                {!isLoggedIn ? (
                    <>
                        <Link to="/login" className="Toolbar_button">Sign in</Link>
                        <Link to="/register" className="Toolbar_button">Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile" className="Toolbar_button">Profile</Link>
                        <Link to="#" onClick={logout} className="Toolbar_button">Logout</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
