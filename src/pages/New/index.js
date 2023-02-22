import '../New/new.css';

import {
  useContext,
  useEffect,
  useState,
} from 'react';

import { FiPlusCircle } from 'react-icons/fi';
import {
  useHistory,
  useParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../componets/Header';
import Title from '../../componets/Title';
import { AuthContext } from '../../contexts/Auth';
import firebase from '../../services/firebaseConnection';

export default function New() {
    const { id } = useParams();
    const history = useHistory();

    const [LoadCustomers, setLoadCustomers] = useState(true);
    const [Customers, setCustomers] = useState([]);
    const [CustomersSelected, setCustomersSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');
    const [idCustomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomer() {
            await firebase.firestore().collection('customers')
                .get()
                .then((snapshot) => {
                    let lista = [];

                snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (lista.length === 0) {
                        console.log('Nenhum cliente encontrado');
                        setCustomers([{
                            id: '1',
                            nomeFantasia: 'FREELA'
                        }]);
                        setLoadCustomers(false);
                        return;
                    }

                    setCustomers(lista);
                    setLoadCustomers(false);
                    
                    if (id) {
                        loadId(lista);
                    }



                    
                })
                .catch((error) => {
                    console.log('Erro ao buscar clientes: ', error);
                    setLoadCustomers(false);
                    setCustomers([{ id: '1', nomeFantasia: '' }]);
                    return;
                })

        }
        loadCustomer();
    }, []);

async function loadId(lista) {
        await firebase.firestore().collection('chamados').doc(id)
            .get()
            .then((snapshot) => {
                setAssunto(snapshot.data().assunto);
                setStatus(snapshot.data().status);
                setComplemento(snapshot.data().complemento);

                let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
                setCustomersSelected(index);
                setIdCustomer(true);
            })
            .catch((error) => {
                console.log('Erro ao buscar chamado: ', error);
               
                setIdCustomer(false);
                return;
            })
    }



    async function handleRegister(e) {
        
        e.preventDefault();

        if (idCustomer) {
            await firebase.firestore().collection('chamados').doc(id)
                .update({
                    cliente: Customers[CustomersSelected].nomeFantasia,
                    clienteId: Customers[CustomersSelected].id,
                    assunto: assunto,
                    status: status,
                    complemento: complemento,
                    userId: user.uid
                })
                .then(() => {
                    setComplemento('');
                    setStatus('Aberto');
                    setAssunto('Suporte');
                    setCustomersSelected(0);
                    toast.success('Chamado editado com sucesso!');
                    history.push('/dashboard');
                })
                .catch((error) => {
                    console.log('Erro ao editar chamado: ', error);


                    toast.error('Erro ao editar chamado, tente novamente!');
                })
            return;
        }



        


        await firebase.firestore().collection('chamados').add({
            created: new Date(),
            cliente: Customers[CustomersSelected].nomeFantasia,
            clienteId: Customers[CustomersSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
            .then(() => {
                setComplemento('');
                setStatus('Aberto');
                setAssunto('Suporte');
                setCustomersSelected(0);
                toast.success('Chamado criado com sucesso!');
            })
            .catch((error) => {
                console.log('Erro ao registrar chamado: ', error);
                toast.error('Erro ao registrar chamado, tente novamente!');
            })

    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value);


    }

    function handleOpitionChange(e) {
        setStatus(e.target.value);
    }

    function handleChangeCustomers(e) {
        setCustomersSelected(e.target.value);
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">

                    <form className="form-profile" onSubmit={handleRegister} >

                        <label>Cliente</label>

                        {LoadCustomers ? (
                            <input type="text" disabled={true} value="Carregando clientes..." />
                        ) : (
                            <select value={CustomersSelected} onChange={handleChangeCustomers} >
                                {Customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                    )
                                })
                                }
                            </select>

                        )}




                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option key={1} value="Suporte">Suporte</option>
                            <option key={2} value="Visita Tecnica">Visita Tecnica</option>
                            <option key={3} value="Financeiro">Financeiro</option>
                        </select>
                        <label>Status</label>
                        <div className="status">
                            <input type="radio"
                                name="radio"
                                value="Aberto"
                                id="aberto"
                                onChange={handleOpitionChange}
                                checked={status === 'Aberto'}
                            />
                            <span htmlFor="aberto">Aberto</span>

                            <input type="radio"
                                name="radio"
                                value="Progresso"
                                id="progresso"
                                onChange={handleOpitionChange}
                                checked={status === 'Progresso'}
                            />
                            <span htmlFor="progresso">Progresso</span>

                            <input type="radio"
                                name="radio"
                                value="Atendido"
                                id="atendido"
                                onChange={handleOpitionChange}
                                checked={status === 'Atendido'}
                            />
                            <span htmlFor="atendido">Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea type="text"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                            placeholder="Descreva seu problema (opcional)" />

                        <button type="submit">Registrar</button>


                    </form>
                </div>



            </div>

        </div>
    );
}