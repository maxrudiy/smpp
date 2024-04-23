import { apiSlice } from "./api-slice";

const messagesSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => ({ url: "messages" }),
    }),
    deleteMessages: builder.mutation({
      query: () => ({
        url: "messages",
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useDeleteMessagesMutation } = messagesSlice;
