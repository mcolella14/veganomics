import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {Controller} from "react-hook-form";
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';

export default function MultiSelect({
    label,
    value,
    possVals,
    control,
    defaultValue,
    rules,
    error,
    helperText,
    name,
    setValue,
    className
}) {

    const handleValueDelete = (chipToDelete) => {
        console.log(chipToDelete);
        console.log(value)
        setValue(name, value.filter((chip) => chip !== chipToDelete));
    };

    return (
        <FormControl className={className}>
            <InputLabel id={name + "-label"}>{label}</InputLabel>
            <Controller
                name={name}
                value={value}
                control={control} 
                defaultValue={defaultValue}
                rules={rules}
                as={                                
                    <Select
                        name={name}
                        error={error}
                        helperText={helperText}
                        labelId={name + "-label"}
                        multiple
                        input={<Input/>}
                        MenuProps={{
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left"
                            },
                            transformOrigin: {
                                vertical: -50,
                                horizontal: "left"
                            },
                            getContentAnchorEl: null
                        }}
                        renderValue={(selected) => (
                            <div>
                            {
                            selected.map((value) => (
                                <Chip 
                                    onMouseDown={(event) => {
                                        event.stopPropagation();
                                    }}
                                    key={value}
                                    label={value}
                                    clickable
                                    onDelete={() => handleValueDelete(value)}
                                    deleteIcon={<CloseIcon/>}
                                />
                            ))
                            }
                            </div>
                        )}
                    > 
                        <MenuItem value="" disabled>{label}</MenuItem>
                        {possVals.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                                {genre}
                            </MenuItem>
                        ))}
                    </Select>
                }
            />
        </FormControl>
    )
}