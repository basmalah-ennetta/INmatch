/** @format */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Set your backend base URL
const API_URL = "http://localhost:5000/user"; // adjust if needed

// ======= ASYNC THUNKS =======

// SIGNUP
export const signupUser = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/signup`, userData);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "Signup failed");
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "Login failed");
    }
  }
);

// GET CURRENT USER
export const getCurrentUser = createAsyncThunk(
  "user/current",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/current`, {
        headers: { Authorization: token },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Unauthorized");
    }
  }
);

// GET ALL USERS (admin)
export const getAllUsers = createAsyncThunk(
  "user/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch users"
      );
    }
  }
);

// UPDATE USER
export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "Update failed");
    }
  }
);

// DELETE USER
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "Delete failed");
    }
  }
);

// ======= INITIAL STATE =======
const initialState = {
  user: null,
  users: [],
  token: localStorage.getItem("token") || null,
  isLoading: false,
  isAuth: false,
  error: null,
  msg: null,
};

// ======= SLICE =======
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.isAuth = false;
      state.token = null;
      state.msg = "Logged out successfully";
    },
  },
  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.newUserToken;
        state.token = action.payload.token;
        state.isAuth = true;
        state.msg = action.payload.msg;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.userExists;
        state.token = action.payload.token;
        state.isAuth = true;
        state.msg = action.payload.msg;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // GET CURRENT USER
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.error = action.payload;
      })

      // GET ALL USERS
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      // UPDATE USER
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.msg = "Profile updated successfully";
      })

      // DELETE USER
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.msg = "User deleted successfully";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
