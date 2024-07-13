import { baseApi } from "./apiSlice";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllOrders: build.query({
      query: (arg) => ({
        url: "/orders",
        params: arg,
        method: "GET",
      }),
      providesTags: ["order"],
    }),
    getSingleOrder: build.query({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: ["order"],
    }),
    makeOrder: build.mutation({
      query: (data) => ({
        url: "/orders/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["order"],
    }),
    updateOrder: build.mutation({
      query: (data) => ({
        url: `/orders/${data.orderId}`,
        method: "PATCH",
        data: data.data,
      }),
      invalidatesTags: ["order"],
    }),
    deleteOrder: build.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useMakeOrderMutation,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
