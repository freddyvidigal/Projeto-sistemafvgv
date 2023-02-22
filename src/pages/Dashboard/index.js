import './dashboard.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';
import {
  FiEdit2,
  FiMessageSquare,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import Header from '../../componets/Header';
import Modal from '../../componets/Modal';
import Title from '../../componets/Title';
import firebase from '../../services/firebaseConnection';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard() {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const[loadingMore, setLoadingMore ] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const [ShowPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();


    useEffect(() => {

        async function loadChamados() {
            await listRef.limit(5)
                .get()
                .then((snapshots) => {
                    updateState(snapshots)
    
                })
                .catch((err) => {
                    console.log('Erro ao buscar os dados: ', err);
                    setLoadingMore(false);
                })
    
                setLoading(false)
    
        }

        loadChamados();

        return () => {

        }
    }, []);

    
    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    status: doc.data().status,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1];  //pega o ultimo documento da lista
            setChamados(chamados => [...chamados, ...lista]);
            setLastDocs(lastDoc);
        } else {
           setIsEmpty(true);
        }   

        setLoadingMore(false)

    }

async function handleMore(){
    setLoadingMore(true);
    await listRef.startAfter(lastDocs).limit(5)
    .get()
    .then((snapshots) => {
        updateState(snapshots)

    })
}

function togglePostModal(item){
    setShowPostModal(!ShowPostModal);
    setDetail(item);


}

if(loading){        
    return(
        <div>
            <Header />

            <div className="content">
                <Title name="Atendimentos">
                    <FiMessageSquare size={25} />
                </Title>

                <div className="container dashboard">
                    <span>Buscando chamados...</span>
                </div>
            </div>
        </div>
    )
}

    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Atendimentos">
                    <FiMessageSquare size={25} />
                </Title>
                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado registrado...</span>

                        <Link to="/new" className='new'>
                            <FiPlus size={25} color="#FFF" />
                            Novo chamado

                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/new" className='new'>
                            <FiPlus size={25} color="#FFF" />
                            Novo chamado

                        </Link>
                        <table>
                            <thead>
                                <tr>
                                    <th scope='col'>Cliente</th>
                                    <th scope='col'>Assunto</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Cadastrado</th>
                                    <th scope='col'>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index) => {
                                    return (
                                        <tr key={index} >
                                    <td data-label="Cliente">{item.cliente}</td>
                                    <td data-label="Assunto">{item.assunto}</td>
                                    <td data-label="Status">
                                        <span className='badge' style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>{item.status}</span>
                                    </td>
                                    <td data-label="Cadastrado">10/10/2021</td>
                                    <td data-label="#">
                                        <button className='action' style={{ backgroundColor: '#3583f6' }} onClick={()=> togglePostModal(item) } >
                                            <FiSearch color="#FFF" size={17} />
                                        </button>
                                        <Link className='action' style={{ backgroundColor: '#F6a935' }} to={`/new/${item.id}`} >
                                            <FiEdit2 color="#FFF" size={17} />
                                        </Link>
                                    </td>
                                </tr>
                                    )
                                })
                                    
                                    }
                                                           
                                
                            </tbody>

                        </table>
                        {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3>}
                    { !loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais</button> }

                    </>
                )}

            </div>
            {ShowPostModal && (
                <Modal
                conteudo={detail}
                close={togglePostModal}
                />
           ) }

        </div>
    )
}