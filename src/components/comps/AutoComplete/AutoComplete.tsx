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
}
const CustomAutocomplete = ({label, options, placeholder, value, onChange, getOptionLabel, onInputChange}: IAutoComplete) => {
    return (
        <React.Fragment>
            <div>
                <label className={style.label}><b>{label}</b></label>
                <Stack spacing={2}
                       width='30vw'
                       minWidth={'200px'}
                       height="auto"
                       >
                    <Autocomplete
                        style={{ width: '100%', marginTop: 5, paddingBottom: 10}}
                        options={options}
                        renderInput={(params) => <TextField {...params} placeholder={placeholder}/>}
                        value={value}
                        onChange={(event, value) => onChange(value)}
                        onInputChange={(event, value) => onInputChange(value)}
                        getOptionLabel={getOptionLabel}
                    />
                </Stack>
            </div>
        </React.Fragment>
    )
}

export default CustomAutocomplete