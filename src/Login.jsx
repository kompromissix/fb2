import './Login.scss'
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import logo from './Main_assets/Name.svg'

export default function Login(){
    const names = ['Вход', 'Регистрация'];
    const paginationRef = useRef(null);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (login, password) => {
        const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });
    
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            console.log('Ты вошёл');
        } else {
            console.error(data.error);
        }
    };
    
    const handleRegister = async (login, password) => {
        const res = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });
    
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            console.log('Регистрация успешна');
        } else {
            console.error(data.error);
        }
    };
    return(
        <>
            <main>
                <section className='background2'>
                    <div>
                        <img src={logo} alt="" />
                        <div>
                            <div>
                                <div>
                                    <div ref={paginationRef} />
                                </div>
                                <Swiper modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]} initialSlide={0} pagination={{el: paginationRef.current, clickable: true, renderBullet: (index, className) => {return `<button class="${className}">${names[index]}</button>`}}} onBeforeInit={(swiper) => {swiper.params.pagination.el = paginationRef.current;}} spaceBetween={50} slidesPerView={1} navigation = {false}  direction='horizontal' allowTouchMove = {false}>
                                    <SwiperSlide>
                                        <input type="text" />
                                        <input type="text" />
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <input type="text" />
                                        <input type="text" />
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}