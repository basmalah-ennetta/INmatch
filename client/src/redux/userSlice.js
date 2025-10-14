/** @format */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// backend base URL
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

// ADD Education
export const addEducation = createAsyncThunk(
  "user/addEducation",
  async ({ id, education }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/${id}/education`, education);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to add education"
      );
    }
  }
);

// ADD Project
export const addProject = createAsyncThunk(
  "user/addProject",
  async ({ id, project }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/${id}/project`, project);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to add project"
      );
    }
  }
);

// UPDATE Education
export const updateEducation = createAsyncThunk(
  "user/updateEducation",
  async ({ id, eduId, updates }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/education/${eduId}`,
        updates
      );
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update education"
      );
    }
  }
);

// UPDATE PROJECT
export const updateProject = createAsyncThunk(
  "user/updateProject",
  async ({ id, projId, updates }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/projects/${projId}`,
        updates
      );
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update project"
      );
    }
  }
);


// DELETE Education
export const deleteEducation = createAsyncThunk(
  "user/deleteEducation",
  async ({ id, eduId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}/education/${eduId}`);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to delete education"
      );
    }
  }
);

// DELETE PROJECT
export const deleteProject = createAsyncThunk(
  "user/deleteProject",
  async ({ id, projId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}/projects/${projId}`);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to delete project"
      );
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
      })

      //ADD Education
      .addCase(addEducation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.user = action.payload;
        state.msg = "Education added successfully";
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      

      //UPDATE Education
      .addCase(updateEducation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.user = action.payload;
        state.msg = "Education updated successfully";
      })
      .addCase(updateEducation.rejected, (state) => {
        state.isLoading = false;
      })

      //DELETE Education
      .addCase(deleteEducation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.user = action.payload;
        state.msg = "Education deleted successfully";
      })
      .addCase(deleteEducation.rejected, (state) => {
        state.isLoading = false;
      })

      //ADD Projects
      .addCase(addProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.user = action.payload;
        state.msg = "Project added successfully";
      })
      .addCase(addProject.rejected, (state) => {
        state.isLoading = false;
      })

      //UPDATE Project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.user = action.payload;
        state.msg = "Project updated successfully";
      })
      .addCase(updateProject.rejected, (state) => {
        state.isLoading = false;
      })

      //DELETE Project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.user = action.payload;
        state.msg = "Project deleted successfully";
      })
      .addCase(deleteProject.rejected, (state) => {
        state.isLoading = false;
      })
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
