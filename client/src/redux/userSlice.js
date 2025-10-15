/** @format */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/user";

// ====================== AUTH THUNKS ======================
export const signupUser = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/signup`, userData);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "user/current",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/current`, {
        headers: { Authorization: token },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Unauthorized");
    }
  }
);

// ====================== ADMIN / GENERAL ======================
export const getAllUsers = createAsyncThunk(
  "user/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

// ====================== PROFILE ======================
export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);

// ====================== SLICE ======================
const initialState = {
  user: null,
  userList: [],
  status: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ========== SIGNUP ==========
      .addCase(signupUser.pending, (state) => {
        state.status = "pending";
        state.erorr = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ========== LOGIN ==========
      .addCase(loginUser.pending, (state) => {
        state.status = "pending";
        state.erorr = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ========== CURRENT USER ==========
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "pending";
        state.erorr = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user || action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ========== GET ALL USERS ==========
      .addCase(getAllUsers.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.userList = action.payload.data?.users || [];
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "fail";
        state.userList = [];
        state.error = action.payload;
      })

      // ========== UPDATE USER ==========
      .addCase(updateUser.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = { ...state.user, ...(action.payload.user || action.payload)};
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ========== DELETE USER ==========
      .addCase(deleteUser.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "success";
        state.userList = action.payload.data;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
