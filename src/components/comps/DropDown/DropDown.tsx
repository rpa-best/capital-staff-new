import React from "react";
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
}
const DropDown = ({name, id, onChange, values, placeholder}: IDropDown) => {
    return (
        <React.Fragment>
            <select className={scss.dropDown} name={name} id={id} onChange={(event) => onChange(event)}>
                <option value={'-1'}>{placeholder}</option>
                {values.map((tempValue) =>
                    <option value={tempValue.value}>{tempValue.label}</option>
                )}
            </select>
        </React.Fragment>
    )
}

export default DropDown