import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { AppContext } from '../App';
import AlertBox from './AlertBox';

const Sidebar = () => {
    const { setcurrentUser, currentUser } = useContext(AppContext);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const btnsRef = useRef();

    const handleclick = () => {
        signOut(auth)
            .then(() => {
                setAlert({ message: 'Logged out successfully, Come back soon ' + currentUser.user.displayName, type: 'verified' });
                setTimeout(() => {
                    localStorage.removeItem("taskUser");
                    setcurrentUser(null);
                }, 2500)
            })
            .catch(error => {
                setAlert({ message: error.message, type: 'report' });
                console.error(error);
            });
        navigate('/login');
    }

    useEffect(() => {
        const btns = btnsRef.current.querySelectorAll('a');
        const btnclick = (btn) => {
            btns.forEach(btn => btn.classList.remove('pri'))
            btn.classList.add('pri');
        }
        btns.forEach(btn => btn.addEventListener('click', () => btnclick(btn)))

        return () => btns?.forEach(btn => btn.removeEventListener('click', () => btnclick(btn)));
    }, [])

    return (
        <>
            <nav className='flex col items-stretch gap j-between'>
                <button className='round btn home flex pri' onClick={() => document.querySelector("main").classList.toggle('close')}>
                    <span className="material-symbols-outlined">drag_handle</span>
                </button>
                <div className="flex j-start col items-stretch gap" ref={btnsRef}>
                    <div className="logo">Tasker</div>
                    <Link to='/' className="pri btn flex link j-start">
                        <span className="material-symbols-outlined">dashboard</span>
                        <p>Dashboard</p>
                    </Link>
                    <Link to='/tasks' className="btn flex link j-start">
                        <span className="material-symbols-outlined">library_books</span>
                        <p>Tasks</p>
                    </Link>
                    <Link to='/users' className="btn flex link j-start">
                        <span className="material-symbols-outlined">group</span>
                        <p>Users</p>
                    </Link>
                </div>
                <button className="btn flex link j-between signout" onClick={handleclick}>
                    <span className="material-symbols-outlined">logout</span>
                    <p>Log Out</p>
                </button>
            </nav>
            {alert && <AlertBox {...alert} setAlert={setAlert} />}
        </>
    )
}

export default Sidebar;