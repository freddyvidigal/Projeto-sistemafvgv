
import './customers.css';
import { useState } from 'react';
import Title from '../../componets/Title';
import Header from '../../componets/Header';
import { FiUsers } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';


export default function Customers() {
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e) {
        e.preventDefault();
        if (nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
            await firebase.firestore().collection('customers')
                .add({
                    nomeFantasia: nomeFantasia,
                    cnpj: cnpj,
                    endereco: endereco
                })
                .then(() => {
                    setNomeFantasia('');
                    setCnpj('');
                    setEndereco('');
                    toast.info('Cliente cadastrado com sucesso!');
                })
                .catch((error) => {
                    console.log(error);
                    toast.error('Ops, algo deu errado!');
                })
        } else {
            toast.error('Preencha todos os campos!');
        }



    }




    return (
        <div>
            <Header />

            <div className="content">

                <Title name="Clientes">
                    <FiUsers size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile customers" onSubmit={handleAdd}>
                        <label>Nome fantasia</label>
                        <input type="text" value={nomeFantasia} placeholder="seu nome" onChange={(e) => setNomeFantasia(e.target.value)} />

                        <label>CNPJ</label>
                        <input type="text" value={cnpj} placeholder="seu CNPJ" onChange={(e) => setCnpj(e.target.value)} />

                        <label>Endereço</label>
                        <input type="text" value={endereco} placeholder="endereço" onChange={(e) => setEndereco(e.target.value)} />

                        <button type="submit">Cadastrar</button>



                    </form>

                </div>
            </div>
        </div>
    )
}