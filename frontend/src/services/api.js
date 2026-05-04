// src/services/api.js — FULL & FIXED
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include', // important for cookies
  }),
  tagTypes: ['User', 'PendingUsers', 'AllUsers'],
  endpoints: (builder) => ({
    // LOGIN
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('token', data.token);
        } catch {}
      },
    }),

    // REGISTER
    register: builder.mutation({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
      }),
    }),

    // LOGOUT — ADD THIS (FIXES YOUR ERROR)
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        localStorage.removeItem('token');
        dispatch({ type: 'auth/logout' }); // optional: clear redux state
      },
    }),

    // ... add more endpoints later (getProfile, getPendingUsers, etc.)
  }),
});

// Export all hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,          // ← NOW EXPORTED — FIXES THE ERROR
} = api;