import React from "react";
import { Stack, Autocomplete, TextField } from "@mui/material";
import style from "../Input/Input.module.scss";

interface IAutoComplete {
    label: string
    options: any
    placeholder: string
    value: any
    onChange: any
    getOptionLabel: any
    onInputChange: any
    disabled?: boolean
}
const CustomAutocomplete = ({label, options, placeholder, value, onChange, getOptionLabel, onInputChange, disabled}: IAutoComplete) => {
    return (
        <React.Fragment>
            <div style={{width:'100%'}}>
                <label className={style.label}><b>{label}</b></label>
                <Stack spacing={2}
                       minWidth={'200px'}
                       height="auto"
                       >
                    <Autocomplete
                        style={{ width: '100%', marginTop: 5}}
                        options={options}
                        renderInput={(params) => <TextField {...params} placeholder={placeholder}/>}
                        value={value}
                        onChange={(event, value) => onChange(value)}
                        onInputChange={(event, value) => onInputChange(value)}
                        getOptionLabel={getOptionLabel}
                        getOptionKey={(option) => option.id}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        disabled={disabled}
                    />
                </Stack>
            </div>
        </React.Fragment>
    )
}

export default CustomAutocomplete