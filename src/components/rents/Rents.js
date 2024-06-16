import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from 'react-oidc-context';

const RentsPage = () => {
    const [rents, setRents] = useState([]);
    const [selectedRentId, setSelectedRentId] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageSize, setCurrentPageSize] = useState(0);
    const pageSize = 5;
    const auth = useAuth();

    const fetchRents = async (page = 0) => {
        try {
            let envString = 'REACT_APP_MICROSERVICE_RENT';
            const response = await fetch(`${process.env[envString]}/api/v1/rents/?page=${page}&size=${pageSize}&sortParam=PRICE_ASC`, {
                method: 'GET',
            });
            const data = await response.json();
            if (data != null) {
                setRents(data.rents);
                setCurrentPageSize(data.size);
            }
        } catch (error) {
            console.error('Error fetching rents:', error);
        }
    };

    useEffect(() => {
        fetchRents(currentPage);
    }, [currentPage]);

    const updateRentStatus = async (formData) => {
        try {
            if (formData.statusId === 4) {
                let envString = 'REACT_APP_MICROSERVICE_RENT';
                const response = await fetch(`${process.env[envString]}/api/v1/rents/${formData.id}/complete`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json", },
                });
                if (response.ok) {
                    fetchRents(currentPage);
                } else {
                    console.error('Error updating status:', response.statusText);
                }
            } else {
                const rentToUpdate = rents.find(rent => rent.id === formData.id);
                const body = JSON.stringify({
                    startDate: rentToUpdate.startDate,
                    endDate: rentToUpdate.endDate,
                    price: rentToUpdate.price,
                    userId: rentToUpdate.userId,
                    statusId: formData.statusId,
                    timeReceivingId: rentToUpdate.timeReceiving.id,
                    receivingMethodId: rentToUpdate.receivingMethod.id,
                    address: rentToUpdate.address,
                    tools: rentToUpdate.tools,
                });
                let envString = 'REACT_APP_MICROSERVICE_RENT';
                const response = await fetch(`${process.env[envString]}/api/v1/rents/${formData.id}`, {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json", },
                    body: body,
                });
                if (response.ok) {
                    fetchRents(currentPage);
                } else {
                    console.error('Error updating status:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleSubmit = async (formData) => {
        await updateRentStatus(formData);
        setOpenModal(false);
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPageSize === pageSize) {
            setCurrentPage(currentPage + 1);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    return (
        <div className="container ping">
            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleSubmit}
                orderId={selectedRentId}
            />
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '30px' }}>
                <thead>
                    <tr style={{ color: 'black', backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '10px', border: '1px solid #dddddd' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Дата начала-конца аренды</th>
                        <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Цена</th>
                        <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Статус</th>
                        <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Способ получения</th>
                        <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Время получения</th>
                        <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Адрес</th>
                        <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Изменить статус</th>
                    </tr>
                </thead>
                <tbody>
                    {rents.map((rent, index) => (
                        <tr
                            key={index}
                            style={{
                                color: 'black',
                                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                            }}
                        >
                            <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{rent.id}</td>
                            <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{formatDate(rent.startDate)}-{formatDate(rent.endDate)}</td>
                            <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{rent.price} руб.</td>
                            <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{rent.status.description}</td>
                            <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{rent.receivingMethod.description}</td>
                            <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{rent.timeReceiving.description}</td>
                            <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{rent.address}</td>
                            <td
                                style={{
                                    padding: '10px',
                                    border: '1px solid #dddddd',
                                    textAlign: 'center',
                                }}
                            >
                                <button
                                    className="ping-button"
                                    onClick={() => {
                                        setSelectedRentId(rent.id);
                                        setOpenModal(true);
                                    }}
                                    style={{ alignItems: 'revert-layer', borderRadius: '30px' }}
                                >
                                    Изменить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    style={{
                        backgroundColor: currentPage === 0 ? '#ddd' : '#F7C815',
                        color: 'black',
                        padding: '10px 20px',
                        borderRadius: '30px',
                        cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                        marginRight: '20px',
                    }}> Назад </button>
                <span style={{ alignSelf: 'center', color: 'black' }}>Страница {currentPage} </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPageSize !== pageSize}
                    style={{
                        backgroundColor: currentPageSize !== pageSize ? '#ddd' : '#F7C815',
                        color: 'black',
                        padding: '10px 20px',
                        borderRadius: '30px',
                        marginLeft: '20px',
                        cursor: currentPageSize !== pageSize ? 'not-allowed' : 'pointer',
                    }}> Вперед </button>
            </div>
        </div>
    );
};

export default RentsPage;
