import React from "react";
import { Link } from 'react-router-dom';
const NavBar = () => {
    return (
        <nav style={{position: 'fixed', top: '0', left: '0', right: '0',backgroundColor:"red"}}>
            <ul>
                <li>
                    <Link to="/trainingPlans">Training Plans</Link> {/* Link do strony z treningami */}
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
