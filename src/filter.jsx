import React, { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  IconButton,
  InputBase,
  Popover,
  Select,
  Slider,
  TextField,
  ThemeProvider,
  Typography,
  useTheme,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";

// Note: The 'tokens' function is included here to make this component self-contained.
// In a larger application, you would typically import this from a shared 'theme.js' file.
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: { 100: "#e0e0e0", 200: "#c2c2c2", 300: "#a3a3a3", 400: "#858585", 500: "#666666", 600: "#525252", 700: "#3d3d3d", 800: "#292929", 900: "#141414" },
        primary: { 100: "#d0d1d5", 200: "#a1a4ab", 300: "#727681", 400: "#1F2A40", 500: "#141b2d", 600: "#101624", 700: "#0c101b", 800: "#080b12", 900: "#040509" },
        greenAccent: { 100: "#dbf5ee", 200: "#b7ebde", 300: "#94e2cd", 400: "#70d8bd", 500: "#4cceac", 600: "#3da58a", 700: "#2e7c67", 800: "#1e5245", 900: "#0f2922" },
        redAccent: { 100: "#f8dcdb", 200: "#f1b9b7", 300: "#e99592", 400: "#e2726e", 500: "#db4f4a", 600: "#af3f3b", 700: "#832f2c", 800: "#58201e", 900: "#2c100f" },
        blueAccent: { 100: "#e1e2fe", 200: "#c3c6fd", 300: "#a4a9fc", 400: "#868dfb", 500: "#6870fa", 600: "#535ac8", 700: "#3e4396", 800: "#2a2d64", 900: "#151632" },
      }
    : {
        grey: { 900: "#e0e0e0", 800: "#c2c2c2", 700: "#a3a3a3", 600: "#858585", 500: "#666666", 400: "#525252", 300: "#3d3d3d", 200: "#292929", 100: "#141414" },
        primary: { 900: "#d0d1d5", 800: "#a1a4ab", 700: "#727681", 600: "#1F2A40", 500: "#141b2d", 400: "#f2f0f0", 300: "#0c101b", 200: "#080b12", 100: "#040509" },
        greenAccent: { 900: "#dbf5ee", 800: "#b7ebde", 700: "#94e2cd", 600: "#70d8bd", 500: "#4cceac", 400: "#3da58a", 300: "#2e7c67", 200: "#1e5245", 100: "#0f2922" },
        redAccent: { 900: "#f8dcdb", 800: "#f1b9b7", 700: "#e99592", 600: "#e2726e", 500: "#db4f4a", 400: "#af3f3b", 300: "#832f2c", 200: "#58201e", 100: "#2c100f" },
        blueAccent: { 900: "#e1e2fe", 800: "#c3c6fd", 700: "#a4a9fc", 600: "#868dfb", 500: "#6870fa", 400: "#535ac8", 300: "#3e4396", 200: "#2a2d64", 100: "#151632" },
      }),
});


const FilterComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filters, setFilters] = useState({
        signup_date: '',
        last_purchase_date: '',
        subscription_status: 'all',
        rating: [1, 5]
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSliderChange = (event, newValue) => {
        setFilters(prev => ({ ...prev, rating: newValue }));
    };

    const handleApplyFilters = () => {
        console.log("Applying filters:", filters);
        handleClose();
    };

    const handleClearFilters = () => {
        setFilters({
            signup_date: '',
            last_purchase_date: '',
            subscription_status: 'all',
            rating: [1, 5]
        });
        console.log("Filters cleared");
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;

    return (
        <>
            <IconButton onClick={handleClick}>
                <FilterList />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    style: {
                        backgroundColor: colors.primary[400],
                        backgroundImage: 'none',
                        padding: '16px',
                        width: '300px',
                        borderRadius: '8px',
                    },
                }}
            >
                <Typography variant="h6" gutterBottom>Filter Options</Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Sign-up Date"
                        type="date"
                        name="signup_date"
                        value={filters.signup_date}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <TextField
                        label="Last Purchase Date"
                        type="date"
                        name="last_purchase_date"
                        value={filters.last_purchase_date}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Subscription Status</InputLabel>
                        <Select
                            name="subscription_status"
                            value={filters.subscription_status}
                            onChange={handleFilterChange}
                            label="Subscription Status"
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                            <MenuItem value="paused">Paused</MenuItem>
                        </Select>
                    </FormControl>
                    <Box>
                        <Typography gutterBottom>Rating</Typography>
                        <Slider
                            value={filters.rating}
                            onChange={handleSliderChange}
                            valueLabelDisplay="auto"
                            min={1}
                            max={5}
                            step={1}
                            marks
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="outlined" onClick={handleClearFilters}>Clear</Button>
                        <Button variant="contained" color="secondary" onClick={handleApplyFilters}>Apply</Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default FilterComponent;