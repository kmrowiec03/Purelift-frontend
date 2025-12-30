import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "/src/style/navigation.css";
import { useAuth } from "../actions/AuthContext.jsx";

const NavBar = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);
    const closeMenu = () => setMenuOpen(false);

    const isCoach = user?.role === 'ROLE_COACH';
    const isAdmin = user?.role === 'ROLE_ADMIN';


    return (
        <>
            <nav className="Navbar">
                <div className="hamburger" onClick={toggleMenu}>
                    <div className="bar" />
                    <div className="bar" />
                    <div className="bar" />
                </div>
                <div className="Toolbar_container_for_buttons Left-toolbar">
                    {/* Linki dla wszystkich zalogowanych */}
                    {isLoggedIn && (
                        <Link to="/trainingPlans" className="Toolbar_button" onClick={closeMenu}>Plany Treningowe</Link>
                    )}
                    {isLoggedIn && (
                        <Link to="/progress" className="Toolbar_button" onClick={closeMenu}>Postęp</Link>
                    )}
                    
                    {/* Linki specyficzne dla ról */}
                    {isLoggedIn && isAdmin && (
                        <Link to="/permissions" className="Toolbar_button" onClick={closeMenu}>Uprawnienia</Link>
                    )}
                    {isLoggedIn && isCoach && (
                        <Link to="/my-clients" className="Toolbar_button" onClick={closeMenu}>Moi Podopieczni</Link>
                    )}
                    {isLoggedIn && !isAdmin && !isCoach && (
                        <Link to="/coaches" className="Toolbar_button" onClick={closeMenu}>Oferty trenerów</Link>
                    )}
                </div>

                <Link to="/" className="NavLogoLink" onClick={closeMenu}>
                    <img src="/src/assets/logo.png" alt="logo" className="NavLogo" />
                </Link>

                <div className="Toolbar_container_for_buttons Right-toolbar">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="Toolbar_button" onClick={closeMenu}>Zaloguj się</Link>
                            <Link to="/register" className="Toolbar_button" onClick={closeMenu}>Zarejestruj się</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="Toolbar_button" onClick={closeMenu}>Profil</Link>
                            <Link to="#" onClick={() => { logout(); closeMenu(); }} className="Toolbar_button">Wyloguj się</Link>
                        </>
                    )}
                </div>

            </nav>
            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
                {/* Linki dla wszystkich zalogowanych */}
                {isLoggedIn && (
                    <Link to="/trainingPlans" className="Toolbar_button" onClick={closeMenu}>Plany Treningowe</Link>
                )}
                {isLoggedIn && (
                    <Link to="/progress" className="Toolbar_button" onClick={closeMenu}>Postęp</Link>
                )}
                
                {/* Linki specyficzne dla ról */}
                {isLoggedIn && isAdmin && (
                    <Link to="/permissions" className="Toolbar_button" onClick={closeMenu}>Uprawnienia</Link>
                )}
                {isLoggedIn && isCoach && (
                    <Link to="/my-clients" className="Toolbar_button" onClick={closeMenu}>Moi Podopieczni</Link>
                )}
                {isLoggedIn && !isAdmin && !isCoach && (
                    <Link to="/coaches" className="Toolbar_button" onClick={closeMenu}>Trenerzy</Link>
                )}
                {!isLoggedIn ? (
                    <>
                        <Link to="/login" className="Toolbar_button" onClick={closeMenu}>Zaloguj się</Link>
                        <Link to="/register" className="Toolbar_button" onClick={closeMenu}>Zarejestruj się</Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile" className="Toolbar_button" onClick={closeMenu}>Profil</Link>
                        <Link to="#" onClick={() => { logout(); closeMenu(); }} className="Toolbar_button">Wyloguj się</Link>
                    </>
                )}
            </div>
        </>
    );
};
export default NavBar;
