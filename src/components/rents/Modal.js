import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, onSubmit, orderId }) => {
    const initialData = {
        id: orderId,
        statusId: '',
    };

    const [formData, setFormData] = useState(initialData);
    const [statuses, setStatuses] = useState([]);

    const fetchStatuses = async () => {
        try {
            const envString = 'REACT_APP_MICROSERVICE_RENT';
            const response = await fetch(`${process.env[envString]}/api/v1/statuses/`, {
                method: 'GET',
            });
            const data = await response.json();
            if (data != null) {
                setStatuses(data);
            }
        } catch (error) {
            console.error('Error fetching statuses:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchStatuses();
        }
    }, [isOpen]);

    useEffect(() => {
        // Обновляем formData при изменении orderId
        setFormData(prevData => ({
            ...prevData,
            id: orderId,
        }));
    }, [orderId]);

    const handleNumberInputChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: parseInt(value, 10),
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData(initialData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    background: 'white',
                    width: 500,
                    height: 'auto',
                    margin: 'auto',
                    padding: '4%',
                    border: '2px solid #000',
                    borderRadius: '10px',
                    boxShadow: '2px solid black',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 5,
                        right: 4,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '20px',
                    }}
                >
                    <span
                        style={{
                            display: 'inline-block',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: '#eee',
                            textAlign: 'center',
                            lineHeight: '30px',
                        }}
                    >
                        &times;
                    </span>
                </button>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '10px',
                    }}
                >
                    <div style={{ marginBottom: '10px', display: 'flex' }}>
                        <label
                            style={{
                                color: 'black',
                                paddingRight: '20px',
                                width: '120px',
                                flex: '0 0 120px',
                                boxSizing: 'border-box',
                                marginTop: '1px',
                            }}
                        >
                            Статус:
                        </label>
                        <select
                            value={formData.statusId}
                            onChange={e => handleNumberInputChange('statusId', e.target.value)}
                            style={{
                                paddingLeft: '5px',
                                flex: 1,
                                height: '30px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                            }}
                        >
                            <option value="" disabled>Выберите статус</option>
                            {statuses.map(status => (
                                <option key={status.id} value={status.id}>{status.description}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            backgroundColor: '#F7C815',
                            color: 'black',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                        }}
                    >
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
