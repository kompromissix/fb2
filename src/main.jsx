import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Header from './Header.jsx'
import Login from './Login.jsx'
import { HashRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter>
            <Header/>
            <Routes>
                <Route index element={<App/>}/>
                <Route path='/App' element={<App/>}/>
                <Route path='/login' element={<Login/>}/>
            </Routes>
        </HashRouter>
    </StrictMode>

)
