
import { useState, useContext } from 'react';

import './signin.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { AuthContext } from './../../contexts/Auth';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, loadingAuth } = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();
        if (email !== '' && password !== '') {
            signIn(email, password)

        }

        if (email === '') {
            alert('Preencha o campo email')
        }

        if (password === '') {
            alert('Preencha o campo senha')
        }
    }

    return (
        <div className='container-center' >
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Logo do Sistema" />
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Entrar</h1>
                    <input type="text" placeholder='email@email.com'
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='******'
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type='submit' >{loadingAuth ? 'carregando..' : 'ACESSAR'}</button>

                </form>

                <Link to="/register">Criar uma conta</Link>
            </div>
        </div>
    );
}


export default SignIn;
