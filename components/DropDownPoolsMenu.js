import React, { useState, useEffect } from 'react';

const DropdownPoolsMenu = ({ pools, defaultSelectedId, onChange }) => {
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => {
        // console.log(pools);
        if (defaultSelectedId) {
            const defaultPool = pools.find(pool => pool._id === defaultSelectedId);
            if (defaultPool) {
                setSelectedItem(defaultPool._id);
            }
        }
    }, [defaultSelectedId, pools]);

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedItem(value);
        if (onChange) {
            onChange(value);
        }

    };


    return (
        <div>
            <select key={0} value={selectedItem} onChange={handleChange}>
                <option value="" disabled>Select an pool</option>
                {pools.map(pool => (
                    <option key={pool._id} value={pool._id}>
                        {pool.label || pool._id}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownPoolsMenu;
