import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { MdDeleteOutline } from 'react-icons/md';
import { useAuth } from 'react-oidc-context';

const ToolsPage = () => {

  const [tools, setTools] = useState([]);

  const [showAddNotePopup, setShowAddTool] = useState(false);
  const [newTool, setNewTool] = useState({
    model: '',
    description: '',
    priceDay: 0,
    count: 0,
    brandId: 0,
    categoryId: 0
  });

  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(0);
  const pageSize = 5;
  const auth = useAuth();

  const fetchTools = async (page = 0) => {
    try {
      let envString = 'REACT_APP_MICROSERVICE_TOOL';
      const response = await fetch(process.env[envString] + `/api/v1/tools/?page=${page}&size=${pageSize}&sortParam=PRICE_ASC`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data != null) {
        setTools(data.tools);
        setCurrentPageSize(data.size);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  useEffect(() => {
    fetchTools(currentPage);
  }, [currentPage]);

  const handleSubmit = async (Data) => {
    try {
      const jsonData = {
        model: Data.model,
        description: Data.description,
        priceDay: Data.priceDay,
        count: Data.count,
        brandId: Data.brandId,
        categoryId: Data.categoryId,
      };
      const formData = new FormData();
      formData.append('image', Data.image);
      formData.append('tool', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));
      console.log('TOKEN:', auth.user.access_token);

      let envString = 'REACT_APP_MICROSERVICE_TOOL';
      const response = await fetch(process.env[envString] + `/api/v1/tools/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchTools(currentPage);
      } else {
        console.error('Error submitting data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };



  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewTool({ ...newTool, [name]: value });
  };

  const handlePopupClose = () => {
    setShowAddTool(false);
    setNewTool({
      model: '',
      description: '',
      priceDay: 0,
      count: 0,
      brandId: 1,
      categoryId: 1,
    });
  };

  const handleAddTool = Data => {
    console.log('New Tool:', Data);
  };

  const handleDeleteTool = async id => {
    try {
      let envString = 'REACT_APP_MICROSERVICE_TOOL';
      await fetch(process.env[envString] + `/api/v1/tools/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
        },
      });
      setTools(prevTools => prevTools.filter(tool => tool.id !== id));
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
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

  return (
    <div className="container ping">
      <button className="ping-button" onClick={() => setOpenModal(true)} style={{ alignItems: 'revert-layer', marginTop: '50px', borderRadius: '30px' }}>
        Создать инструмент
      </button>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />
      {showAddNotePopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handlePopupClose}>
              &times;
            </span>
            <div style={{ padding: '20px', textAlign: 'center', color: 'black' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                Модель:
                <input
                  type="text"
                  name="model"
                  value={newTool.model}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box',
                  }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                Цена в час:
                <textarea
                  type="number"
                  name="priceDay"
                  value={newTool.priceDay}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                  }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                Кол-во:
                <textarea
                  type="number"
                  name="count"
                  value={newTool.count}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                  }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                Описание:
                <textarea
                  type="text"
                  name="description"
                  value={newTool.description}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                  }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                Категория:
                <select
                  type='number'
                  name="categoryId"
                  value={newTool.categoryId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                  }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                Бренд:
                <select
                  type='number'
                  name="brandId"
                  value={newTool.brandId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                  }}
                />
              </label>
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
                Изображение:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </label>

              <button
                onClick={handleAddTool}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                }}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ color: 'black', backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Изображение</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Модель</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Цена аренды в час</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Кол-во инструментов</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Бренд</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Описание</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Категория</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, index) => (
            <tr
              key={index}
              style={{
                color: 'black',
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
              }}
            >
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}><img src={tool.imageUrl} alt={tool.model} className="navbar-icon" /></td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{tool.model}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{tool.priceDay}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{tool.count}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{tool.brand.name}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{tool.description}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{tool.category.name}</td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #dddddd',
                  textAlign: 'center',
                }}
              >
                <MdDeleteOutline style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteTool(tool.id)} />{' '}
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
            marginRight: '20px', // Добавлено расстояние между кнопками
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

export default ToolsPage;
