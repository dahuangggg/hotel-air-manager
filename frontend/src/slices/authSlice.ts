import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { TypedDispatch } from '../store';

const initialState = {};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
});

export default authSlice.reducer;
