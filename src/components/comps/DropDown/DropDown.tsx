import React, {useState} from "react";
import scss from "./DropDown.module.scss"

interface IValue {
    value: any,
    label: string
}

interface IDropDown {
    name: string,
    id: string,
    placeholder: string
    onChange: (event: any) => void
    values: IValue[]
    value?: any,
    required?: boolean
}

const DropDown = ({name, id, onChange, values, value, placeholder, required}: IDropDown) => {
    const [selectedValue, setSelectedValue] = useState(value);
    
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value)
        onChange(event)
    }
    
    return (
        <React.Fragment>
            <select
                id={id}
                name={name}
                className={scss.dropDown}
                value={selectedValue}
                onChange={handleChange}
            >

                <option value={'-1'} disabled={required}>{placeholder}</option>
                
                {values.map((tempValue) =>
                    <option value={tempValue.value}>{tempValue.label}</option>
                )}
            </select>
        </React.Fragment>
    )
}

export default DropDown