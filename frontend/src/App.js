import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Home.js';
import Login from './Login.js';
import Register from './Register.js';
import Board from './Board.js';


export default function App() {
    return (
        <div className='App'>
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/login' element={<Login />}/>
                <Route path='/register' element={<Register />}/>
                <Route path='/boards/:uuid' element={<Board />}/>
            </Routes>
        </div>
    );
}
