import { buildResponse } from "@/lib";
import { baseApi } from "@/redux/api/baseApi";

export const deshboardApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Dashboard ────────────────────────────────────────────────────────────
    getDashboard: builder.query<any, { year: number; month: number }>({
      query: ({ year, month }) => ({
        url: `/dashboard`,
        method: "GET",
        params: { registration: "month", year, month },
      }),
      providesTags: ["user"],
    }),

    // ── Landlords list ───────────────────────────────────────────────────────
    getLandlords: builder.query({
      query: (arg?: Record<string, any>) => ({
        url: "/dashboard/getLandlords",
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => buildResponse(res),
    }),

    // ── Single landlord details ──────────────────────────────────────────────
    getLandlordDetails: builder.query<any, number | null>({
      query: (id) => ({
        url: `/dashboard/getLandlordsDetails/${id}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data,
    }),

    // ── Managers list ────────────────────────────────────────────────────────
    getManagers: builder.query({
      query: (arg?: Record<string, any>) => ({
        url: "/dashboard/getManagers",
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => buildResponse(res),
      providesTags: ["manager"],
    }),

    // ── Single manager units ─────────────────────────────────────────────────
    getManagerUnits: builder.query<any, number | null>({
      query: (id) => ({
        url: `/dashboard/getManagersUnits/${id}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data,
      providesTags: ["manager"],
    }),
    // ── Maintenance list ─────────────────────────────────────────────────────────
    getMaintenance: builder.query({
      query: (arg?: Record<string, any>) => ({
        url: "/dashboard/getMaintenance",
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => buildResponse(res),
      providesTags: ["maintenance", "tenant"],
    }),
    // ── Appointments list ────────────────────────────────────────────────────────
    getAppointments: builder.query({
      query: (arg?: Record<string, any>) => ({
        url: "/dashboard/getAppointments",
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => buildResponse(res),
      providesTags: ["appointment"],
    }),
    // ── Support list ─────────────────────────────────────────────────────────────
    getSupports: builder.query({
      query: (arg?: Record<string, any>) => ({
        url: "/settings/support",
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => buildResponse(res),
      providesTags: ["support"],
    }),

    // ── Delete support ────────────────────────────────────────────────────────────
    deleteSupport: builder.mutation({
      query: (id: number) => ({
        url: `/settings/support/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["support"],
    }),

    // ── FAQ ───────────────────────────────────────────────────────────────────────
    getFaqs: builder.query({
      query: () => ({ url: "/settings/faq", method: "GET" }),
      transformResponse: (res: any) => res?.data,
      providesTags: ["faq"],
    }),

    // ── FAQ Mutations ──────────────────────────────────────────────────────────
    addFaq: builder.mutation({
      query: (data: { question: string; answer: string }) => {
        const formData = new FormData();
        formData.append("question", data.question);
        formData.append("answer", data.answer);
        return {
          url: "/settings/faq",
          method: "POST",
          data: formData, // body → data
        };
      },
      invalidatesTags: ["faq"],
    }),

    updateFaq: builder.mutation({
      query: ({
        id,
        question,
        answer,
      }: {
        id: number;
        question: string;
        answer: string;
      }) => {
        const formData = new FormData();
        formData.append("question", question);
        formData.append("answer", answer);
        return {
          url: `/settings/faq/${id}`,
          method: "POST",
          data: formData, // body → data
        };
      },
      invalidatesTags: ["faq"],
    }),
    deleteFaq: builder.mutation({
      query: (id: number) => ({
        url: `/settings/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faq"],
    }),
    getTenants: builder.query({
      query: (arg?: Record<string, any>) => ({
        url: "/dashboard/getTenants",
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => buildResponse(res),
      providesTags: ["tenant"],
    }),

    // ── Delete tenant ─────────────────────────────────────────────────────────────
    deleteTenant: builder.mutation({
      query: (id: number) => ({
        url: `/dashboard/deleteUser/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tenant"],
    }),
    changePassword: builder.mutation({
      query: (data: {
        current_password: string;
        password: string;
        password_confirmation: string;
      }) => {
        const formData = new FormData();
        formData.append("current_password", data.current_password);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);

        return {
          url: `/settings/update/password`,
          method: "POST",
          data: formData,
          ContentType: "multipart/form-data",
        };
      },
    }),
    getAboutUs: builder.query({
      query: () => ({
        url: `/settings/about-us`,
        method: "GET",
      }),
      providesTags: ["AboutUs"],
    }),

    // About Us - POST/UPDATE
    updateAboutUs: builder.mutation({
      query: (data: { about_us: string; type: string }) => {
        const formData = new FormData();
        formData.append("about_us", data.about_us);
        formData.append("type", data.type);

        return {
          url: `/settings/about-us`,
          method: "POST",
          data: formData,
          ContentType: "multipart/form-data",
        };
      },
      invalidatesTags: ["AboutUs"],
    }),
    getTermsCondition: builder.query({
      query: () => ({
        url: `/settings/terms-condition`,
        method: "GET",
      }),
      providesTags: ["TermsCondition"],
    }),

    updateTermsCondition: builder.mutation({
      query: (data: { terms_condition: string }) => {
        const formData = new FormData();
        formData.append("terms_condition", data.terms_condition);

        return {
          url: `/settings/terms-condition`,
          method: "POST",
          data: formData,
          ContentType: "multipart/form-data",
        };
      },
      invalidatesTags: ["TermsCondition"],
    }),

    updateProfile: builder.mutation({
      query: (data: { name: string }) => {
        const formData = new FormData();
        formData.append("name", data.name);
        return {
          url: `/settings/update/profile`,
          method: "POST",
          data: formData,
          ContentType: "multipart/form-data",
        };
      },
      invalidatesTags: ["Profile"],
    }),

    updateProfileImage: builder.mutation({
      query: (formData: FormData) => ({
        url: `/settings/update/profile/img`,
        method: "POST",
        data: formData,
        ContentType: "multipart/form-data",
      }),
      invalidatesTags: ["Profile"],
    }),
    getTenantDetails: builder.query({
      query: (id: number) => ({
        url: `/dashboard/tenants-details/${id}`,
        method: "GET",
      }),
      providesTags: ["tenant"],
    }),
    createPlan: builder.mutation({
      query: (body: { price: string; interval: string }) => ({
        url: `/dashboard/createPlan`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: body.price, interval: body.interval }),
      }),
    }),
    getPropertyDetails: builder.query({
      query: (id: number) => ({
        url: `/dashboard/property-details/${id}`,
        method: "GET",
      }),
    }),
    deleteProperty: builder.mutation({
      query: (id: number) => ({
        url: `/dashboard/property-delete/${id}`,
        method: "DELETE",
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: `/profile`,
        method: "GET",
      }),
    }),
    replySupport: builder.mutation({
      query: ({ id, reply }: { id: number; reply: string }) => {
        const formData = new FormData();
        formData.append("reply", reply);
        return {
          url: `/settings/support/reply/${id}`,
          method: "POST",
          data: formData,
        };
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDashboardQuery,
  useCreatePlanMutation,
  useGetLandlordsQuery,
  useGetLandlordDetailsQuery,
  useGetManagersQuery,
  useGetManagerUnitsQuery,
  useGetMaintenanceQuery,
  useGetAppointmentsQuery,
  useDeleteSupportMutation,
  useGetSupportsQuery,
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useDeleteTenantMutation,
  useGetTenantsQuery,
  useChangePasswordMutation,
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
  useGetTermsConditionQuery,
  useUpdateTermsConditionMutation,
  useGetProfileQuery,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
  useGetTenantDetailsQuery,
  useGetPropertyDetailsQuery,
  useDeletePropertyMutation,
  useReplySupportMutation,
  useLogoutMutation,
} = deshboardApiSlice;
