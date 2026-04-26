import './Header.scss'
import logo from './Main_assets/Name_white.svg'
import {Link} from 'react-router-dom'

export default function Header(){
    return(
        <>
            <header>
                <nav>
                    <div>
                        <Link to="/App"><img src={logo} alt="" /></Link>
                        <Link to="/guide">Руководство</Link>
                        <Link to="/faq">FAQ</Link>
                    </div>

                    <Link to="/login">Вход</Link>
                </nav>
            </header>
        </>
    )
}