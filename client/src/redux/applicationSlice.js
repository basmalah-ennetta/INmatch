/** @format */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/application";

// ========== ASYNC THUNKS ==========

// Get all applications for logged-in user
export const getUserApplications = createAsyncThunk(
  "application/getUserApplications",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/myApplications`, {
        headers: { Authorization: token },
      });
      return res.data.applications;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch applications"
      );
    }
  }
);

// Create a new application (used by interns applying to offers)
export const createApplication = createAsyncThunk(
  "application/createApplication",
  async (offerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/apply/${offerId}`,
        {},
        { headers: { Authorization: token } }
      );
      return res.data.application;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to apply to offer"
      );
    }
  }
);

// Delete an application (optional)
export const deleteApplication = createAsyncThunk(
  "application/deleteApplication",
  async (applicationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${applicationId}`, {
        headers: { Authorization: token },
      });
      return applicationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to delete application"
      );
    }
  }
);

// ========== SLICE ==========

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applications: [],
    isLoading: false,
    error: null,
    msg: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all applications
      .addCase(getUserApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(getUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createApplication.fulfilled, (state, action) => {
        state.applications.push(action.payload);
        state.msg = "Application submitted successfully";
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (a) => a._id !== action.payload
        );
      });
  },
});

export default applicationSlice.reducer;
