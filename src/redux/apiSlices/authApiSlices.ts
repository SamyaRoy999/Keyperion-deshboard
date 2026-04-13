import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "../api/baseApi";
import { buildResponse } from "@/lib";

// authApiSlices.ts
export const authSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyOtp: builder.mutation<any, { email: string; otp: string }>({
      query: (data) => ({
        url: `/verify/otp`,
        method: "POST",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["user"],
    }),
    loginUser: builder.mutation<any, any>({
      query: (data) => ({
        url: `/login`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["user"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `/forget/password/otp`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: `/forget/password`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["user"],
    }),

    logout: builder.mutation<any, void>({
      query: () => ({
        url: `/logout`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useVerifyOtpMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authSlice;
