// src/components/SearchableRestaurantSelect.js
import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function SearchableRestaurantSelect({ onSelectRestaurant }) {
  const [options, setOptions] = useState([]);

  const handleInputChange = async (inputValue) => {
    if (!inputValue) {
      setOptions([]);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/restaurants/search`, {
        params: { q: inputValue }
      });
      const data = response.data.map(r => ({
        value: r.restaurant_id,
        label: r.name
      }));
      setOptions(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleChange = (selected) => {
    if (!selected) {
      onSelectRestaurant(null);
    } else {
      onSelectRestaurant(selected.value);
    }
  };

  return (
    <Select
      placeholder="Type restaurant name..."
      onInputChange={handleInputChange}
      onChange={handleChange}
      options={options}
      isClearable
    />
  );
}

export default SearchableRestaurantSelect;
