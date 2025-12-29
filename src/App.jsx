import React from 'react'
import TrainingPlans from './components/TrainingPlans'
import Home from './components/Home'
import NavBar from './components/NavBar'
import CoachList from "./components/CoachList.jsx";
import TrainingPlanDetails from "./components/TrainingPlanDetails.jsx";
import GeneratePlanPage from "./components/GeneratePlanPage.jsx";
import CreatePlanPage from "./components/CreatePlanPage.jsx";
import MyClients from "./components/MyClients.jsx";
import AdminPermissions from "./components/AdminPermissions.jsx";
import ExerciseProgress from "./components/ExerciseProgress.jsx";

import "./style/App.css";
import "./style/text.css"

import {  Routes, Route } from 'react-router-dom';
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Profile from "./components/Profile.jsx";


function App() {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
            <NavBar/>
            <div className="app-content">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/trainingPlans" element={<TrainingPlans/>}/>
                    <Route path="/coaches" element={<CoachList/>}/>
                    <Route path="/my-clients" element={<MyClients/>}/>
                    <Route path="/permissions" element={<AdminPermissions/>}/>
                    <Route path="/progress" element={<ExerciseProgress/>}/>
                    <Route path="/trainingPlans/:id" element={<TrainingPlanDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/generate-plan" element={<GeneratePlanPage />} />
                    <Route path="/create-plan" element={<CreatePlanPage />} />
                </Routes>
            </div>
        </>


    )
}

export default App