import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const initialData = {
    model: '',
    description: '',
    priceDay: 0,
    count: 0,
    brandId: 1,
    categoryId: 1,
    image: null,
  };

  const [formData, setFormData] = useState(initialData);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchBrands = async () => {
    try {
      const envString = 'REACT_APP_MICROSERVICE_TOOL';
      const response = await fetch(`${process.env[envString]}/api/v1/brands/?page=0&size=25&sortParam=PRICE_ASC`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data != null) {
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const envString = 'REACT_APP_MICROSERVICE_TOOL';
      const response = await fetch(`${process.env[envString]}/api/v1/categories/?page=0&size=25&sortParam=PRICE_ASC`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data != null) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
      fetchCategories();
    }
  }, [isOpen]);

  const handleInputChange = (fieldName, value) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleNumberInputChange = (fieldName, value) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: parseInt(value, 10),
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        image: file,
      }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData(initialData);
    setImagePreview(null);
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
              Модель:
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={e => handleInputChange('model', e.target.value)}
              style={{
                paddingLeft: '5px',
                flex: 1,
                height: '30px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
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
              Цена в час:
            </label>
            <input
              type='number'
              value={formData.priceDay}
              onChange={e => handleNumberInputChange('priceDay', e.target.value)}
              style={{
                paddingLeft: '5px',
                flex: 1,
                height: '30px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
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
              Кол-во:
            </label>
            <input
              type='number'
              value={formData.count}
              onChange={e => handleNumberInputChange('count', e.target.value)}
              style={{
                paddingLeft: '5px',
                flex: 1,
                height: '30px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
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
              Описание:
            </label>
            <textarea
              type='text'
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              style={{
                paddingLeft: '5px',
                flex: 1,
                minHeight: '80px',
                height: 'auto',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            ></textarea>
          </div>
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
              Категория:
            </label>
            <select
              value={formData.categoryId}
              onChange={e => handleNumberInputChange('categoryId', e.target.value)}
              style={{
                paddingLeft: '5px',
                flex: 1,
                height: '30px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            >
              <option value="" disabled>Выберите категорию</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
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
              Бренд:
            </label>
            <select
              value={formData.brandId}
              onChange={e => handleNumberInputChange('brandId', e.target.value)}
              style={{
                paddingLeft: '5px',
                flex: 1,
                height: '30px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            >
              <option value="" disabled>Выберите бренд</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
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
              Изображение:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {imagePreview && (
            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '50%',
                  maxHeight: '200px',
                  borderRadius: '10px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
          )}
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
