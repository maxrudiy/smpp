import React from "react";
import { useDeleteMessagesMutation, useGetMessagesQuery } from "../api/messages-api-slice";

function Messages() {
  const { data, isFetching, isLoading } = useGetMessagesQuery({}, { pollingInterval: 2000 });

  const toLocalTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("uk-UA");
  };
  return (
    <>
      {data &&
        data.map((value, index) => (
          <div key={index}>
            <div>Час: {toLocalTime(value.createdAt)}</div>
            <div>Телефон: {value.sourceAddr}</div>
            <div>Дані: {value.message}</div>
            <div>Метод: {value.method}</div>
            <br />
          </div>
        ))}
    </>
  );
}

export { Messages };
