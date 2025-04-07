import React from 'react'
import TrainingPlans from './components/TrainingPlans'
import NavBar from './components/NavBar'
import "./style/App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/trainingPlans" element={<TrainingPlans/>}/>
            </Routes>


        </Router>

)
}

export default App