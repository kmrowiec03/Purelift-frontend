import React from 'react'
import TrainingPlans from './components/TrainingPlans'
import Home from './components/Home'
import NavBar from './components/NavBar'

import "./style/App.css";
import "./style/text.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

    return (

        <Router>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/trainingPlans" element={<TrainingPlans/>}/>
            </Routes>


        </Router>

    )
}

export default App