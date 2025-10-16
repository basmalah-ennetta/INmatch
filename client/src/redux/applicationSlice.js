/** @format */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/application";

// ================== INTERN ACTIONS ==================

// apply
export const createApplication = createAsyncThunk(
  "application/create",
  async (appData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/newapplication`, appData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create application"
      );
    }
  }
);

// delete
export const deleteApplication = createAsyncThunk(
  "application/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.res?.data || "Failed to delete application"
      );
    }
  }
);

// ================== ENTREPRISE ACTIONS ==================

// update status (reject/accept)
export const updateApplicationStatus = createAsyncThunk(
  "application/updateStatus",
  async ({ id, editedApp }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, editedApp);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update status");
    }
  }
);

// see
export const getApplications = createAsyncThunk(
  "application/getApps",
  async () => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
// ================== SLICE ==================
const initialState = {
  applicationList: [],
  status: null,
  error: null,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== CREATE =====
      .addCase(createApplication.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.status = "success";
        state.application = action.payload.application;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ===== GET ALL =====
      .addCase(getApplications.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.status = "success";
        state.applicationList = action.payload.applications || [];
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ===== UPDATE STATUS =====
      .addCase(updateApplicationStatus.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.status = "success";
        state.applications = action.payload;
      })

      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ===== DELETE =====
      .addCase(deleteApplication.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      });
  },
});

export const { clearSelectedApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
