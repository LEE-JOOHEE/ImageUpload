import React from 'react';

const CustomInput = ({ label, value, setValue, type="text" }) => {
  return (
    <div className='comm-input'>
      <label>{label}</label>
      <input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        type={type}
        placeholder={`${label}`}
      />
    </div>
  );
};

export default CustomInput;