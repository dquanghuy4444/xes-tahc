import React from "react"

import SearchIcon from "@mui/icons-material/Search"
import FormControl from "@mui/material/FormControl"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"

export default function SearchInput(props){
    return (
        <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount">Tìm kiếm</InputLabel>

            <OutlinedInput
                id="outlined-adornment-amount"
                label="Amount"
                size="small"
                startAdornment={ (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                  ) }
                { ...props }
            />
        </FormControl>
    )
}
