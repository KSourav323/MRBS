import React, { useState, useEffect } from 'react';
import '../style/areas.css';

const Areas = ({ items, onSelect, defaultSelected = items[0] }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultSelected);

  useEffect(() => {
    if (defaultSelected && onSelect) {
      onSelect(defaultSelected);
    }
  }, []);


  const handleSelect = (item) => {
    setSelected(item);
    setOpen(false);
    if (onSelect) { 
      onSelect(item);
    }
  };

  return (
    <div id='dropdown'>
      <button id='dropdown-button'
        onClick={() => setOpen(!open)}
      >
        {selected || defaultText}
      </button>
      {open && (
        <ul id='dropdown-list'>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              id='dropdown-item'
              
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Areas;
