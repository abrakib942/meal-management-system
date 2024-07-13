import { baseApi } from "./apiSlice";

export const mealApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllMeals: build.query({
      query: (arg) => ({
        url: "/meals",
        params: arg,
        method: "GET",
      }),
      providesTags: ["meal"],
    }),
    getSingleMeal: build.query({
      query: (mealId) => ({
        url: `/meals/${mealId}`,
        method: "GET",
      }),
      providesTags: ["meal"],
    }),
    createMeal: build.mutation({
      query: (data) => ({
        url: "/meals/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["meal"],
    }),
    updateMeal: build.mutation({
      query: (data) => ({
        url: `/meals/${data.mealId}`,
        method: "PATCH",
        data: data.data,
      }),
      invalidatesTags: ["meal"],
    }),
    deleteMeal: build.mutation({
      query: (mealId) => ({
        url: `/meals/${mealId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["meal"],
    }),
  }),
});

export const {
  useCreateMealMutation,
  useGetAllMealsQuery,
  useGetSingleMealQuery,
  useDeleteMealMutation,
  useUpdateMealMutation,
} = mealApi;
