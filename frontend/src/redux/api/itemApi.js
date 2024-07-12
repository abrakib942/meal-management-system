import { baseApi } from "./apiSlice";

export const itemApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllItems: build.query({
      query: (arg) => ({
        url: "/items",
        params: arg,
        method: "GET",
      }),
      providesTags: ["item"],
    }),
    getSingleItem: build.query({
      query: (itemId) => ({
        url: `/items/${itemId}`,
        method: "GET",
      }),
      providesTags: ["item"],
    }),
    createItem: build.mutation({
      query: (data) => ({
        url: "/items/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["item"],
    }),
    updateItem: build.mutation({
      query: (data) => ({
        url: `/items/${data.itemId}`,
        method: "PATCH",
        data: data.data,
      }),
      invalidatesTags: ["item"],
    }),
    deleteItem: build.mutation({
      query: (itemId) => ({
        url: `/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["item"],
    }),
  }),
});

export const {
  useGetAllItemsQuery,
  useGetSingleItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemApi;
