// 'use client'

import React from 'react'
import Select from 'react-select';
import { useState } from 'react';

const SortOrder = () => {
    const [sortOrder, setSortOrder] = useState('Newest');
    const options = [
        { value: 'latest', label: 'Latest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'popular', label: 'Most Popular' },
      ];
    
  return (
    <div className="flex gap-x-4 mb-4 items-baseline">
        <h2 className="text-md mb-2">SHOW POSTS</h2>

        <Select
          options={options}
          value={options.find((option) => option.value === sortOrder)}
          onChange={(selected) => setSortOrder(selected.value)}
          className="w-1/4 text-sm"
          defaultInputValue="Latest"
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: '30px', // Reduce control height
              padding: '0', // Remove extra padding
              // boxShadow: 'none', // Remove focus box shadow
              borderColor: 'transparent', // No border on focus
              '&:hover': {
                borderColor: '#d1d5db', // Optional: Change border on hover
              },
            }),
            option: (provided, state) => ({
              ...provided,
              padding: '4px 8px', // Adjust padding for each option
              backgroundColor: state.isFocused ? '#d1d5db' : 'white', // Highlight background on hover
              color: 'black',
              fontSize: '0.875rem', // Tailwind's text-sm
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              padding: '4px',
            }),
            menu: (provided) => ({
              ...provided,
              margin: '0', // Remove extra spacing
            }),
          }}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: '#d1d5db', // Hover color for options
              primary: 'transparent', // Disable default blue outline
            },
          })}
        />


      </div>
  )
}

export default SortOrder
