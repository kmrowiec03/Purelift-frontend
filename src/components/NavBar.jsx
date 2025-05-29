import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "/src/style/navigation.css";
import { useAuth } from "../actions/AuthContext.jsx";

const NavBar = () => {
    const { isLoggedIn, logout } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);
    const closeMenu = () => setMenuOpen(false);


    return (
        <>
            <nav className="Navbar">
                <div className="hamburger" onClick={toggleMenu}>
                    <div className="bar" />
                    <div className="bar" />
                    <div className="bar" />
                </div>
                <div className="Toolbar_container_for_buttons Left-toolbar">
                    <Link to="/articles" className="Toolbar_button" onClick={closeMenu}>Articles</Link>
                    {isLoggedIn && (
                        <Link to="/trainingPlans" className="Toolbar_button" onClick={closeMenu}>Training Plans</Link>
                    )}
                </div>

                <Link to="/" className="NavLogoLink" onClick={closeMenu}>
                    <img src="/src/assets/logo.png" alt="logo" className="NavLogo" />
                </Link>

                <div className="Toolbar_container_for_buttons Right-toolbar">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="Toolbar_button" onClick={closeMenu}>Sign in</Link>
                            <Link to="/register" className="Toolbar_button" onClick={closeMenu}>Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="Toolbar_button" onClick={closeMenu}>Profile</Link>
                            <Link to="#" onClick={() => { logout(); closeMenu(); }} className="Toolbar_button">Logout</Link>
                        </>
                    )}
                </div>

            </nav>
            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
                <Link to="/articles" className="Toolbar_button" onClick={closeMenu}>Articles</Link>
                {isLoggedIn && (
                    <Link to="/trainingPlans" className="Toolbar_button" onClick={closeMenu}>Training Plans</Link>
                )}
                {!isLoggedIn ? (
                    <>
                        <Link to="/login" className="Toolbar_button" onClick={closeMenu}>Sign in</Link>
                        <Link to="/register" className="Toolbar_button" onClick={closeMenu}>Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile" className="Toolbar_button" onClick={closeMenu}>Profile</Link>
                        <Link to="#" onClick={() => { logout(); closeMenu(); }} className="Toolbar_button">Logout</Link>
                    </>
                )}
            </div>
        </>
    );
};
export default NavBar;
