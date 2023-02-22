
import { useContext } from 'react';
import '../Header/header.css';
import { AuthContext } from '../../contexts/Auth';
import avatar from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from "react-icons/fi";


export default function Header() {
    const { user } = useContext(AuthContext);

    return (
        <div className='sidebar'>
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="foto avatar" />


                <Link to="/dashboard ">
                    <FiHome color='#fff' size={24} />
                    Chamados
                </Link>
                <Link to="/customers ">
                    <FiUser color='#fff' size={24} />
                    Clientes
                </Link>
                <Link to="/profile ">
                    <FiSettings color='#fff' size={24} />
                    Configurações
                </Link>
            </div>
        </div >
    )
}