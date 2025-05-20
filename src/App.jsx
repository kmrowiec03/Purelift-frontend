import React from 'react'
import TrainingPlans from './components/TrainingPlans'
import Home from './components/Home'
import NavBar from './components/NavBar'
import ArticleList from "./components/ArticleList.jsx";
import TrainingPlanDetails from "./components/TrainingPlanDetails.jsx";

import "./style/App.css";
import "./style/text.css"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";


function App() {

    return (

        <Router>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/trainingPlans" element={<TrainingPlans/>}/>
                <Route path="/articles" element={<ArticleList/>}/>
                <Route path="/trainingPlans/:id" element={<TrainingPlanDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>


        </Router>

    )
}

export default App