import './Header.scss'
import logo from './Main_assets/Name_white.svg'
import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Header(){
    const [user, setUser] = useState(null)
    useEffect(() => {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (token && savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])
    useEffect(() => {
        const loadUser = () => {
            const savedUser = localStorage.getItem('user')
            if (savedUser) {
                setUser(JSON.parse(savedUser))
            }
        };

        loadUser()
      
        window.addEventListener('authChange', loadUser)
        return () => window.removeEventListener('authChange', loadUser)
    }, []);
    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        window.dispatchEvent(new Event('authChange'))
    };
    return(
        <>
            <header>
                <nav>
                    <div>
                        <Link to="/App"><img src={logo} alt="" /></Link>
                        <Link to="/guide">Руководство</Link>
                        <Link to="/faq">FAQ</Link>
                    </div>
                    {user ? (
                        <div>
                            <Link to="/Profile">{user.login}</Link>
                            <button onClick={logout}>&#215;</button>
                        </div>
                    ) : (
                        <Link to="/login">Вход</Link>
                    )}
                </nav>
            </header>
        </>
    )
}