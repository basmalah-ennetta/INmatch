/** @format */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/offer";

// ====================== THUNKS ======================

// Create a new offer
export const createOffer = createAsyncThunk(
  "offer/create",
  async (offerData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/newOffer`, offerData);
      return res.data; // backend returns the created offer object
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create offer");
    }
  }
);

// Get all offers
export const getAllOffers = createAsyncThunk("offer/getAll", async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data; // backend returns array of offers
  } catch (error) {
    console.log(error);
  }
});

export const getOffersByCompany = createAsyncThunk(
  "offer/getByCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/company/${companyId}`);
      return res.data.offers; // because backend sends { offers: [...] }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Update an offer
export const updateOffer = createAsyncThunk(
  "offer/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      return res.data; // backend returns updated offer object
    } catch (error) {
      return rejectWithValue(error.res?.data || "Failed to update offer");
    }
  }
);

// Delete an offer
export const deleteOffer = createAsyncThunk(
  "offer/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return res; // return the deleted offer ID
    } catch (error) {
      return rejectWithValue(error.res?.data || "Failed to delete offer");
    }
  }
);

// ====================== SLICE ======================
const initialState = {
  offers: [],
  status: null,
  error: null,
};

const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== CREATE =====
      .addCase(createOffer.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.status = "success";
        state.offer = action.payload.offer;
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ===== GET ALL =====
      .addCase(getAllOffers.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getAllOffers.fulfilled, (state, action) => {
        state.status = "success";
        state.offers = action.payload.offers || [];
      })
      .addCase(getAllOffers.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ===== GET By Company =====
      .addCase(getOffersByCompany.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getOffersByCompany.fulfilled, (state, action) => {
        state.status = "success";
        state.offers = action.payload;
      })

      .addCase(getOffersByCompany.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ===== UPDATE =====
      .addCase(updateOffer.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.status = "success";
        state.offers = action.payload;
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      })

      // ===== DELETE =====
      .addCase(deleteOffer.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.status = "success";
        state.offers = action.payload.data;
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.payload;
      });
  },
});

export const { clearOffers } = offerSlice.actions;
export default offerSlice.reducer;
