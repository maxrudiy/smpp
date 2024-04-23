import React from "react";
import { useDeleteMessagesMutation, useGetMessagesQuery } from "../api/messages-api-slice";

function Messages() {
  const { data, isFetching, isLoading } = useGetMessagesQuery({}, { pollingInterval: 2000 });
  return (
    <>
      {data &&
        data.map((value, index) => (
          <div key={index}>
            <div>Час: {value.createdAt}</div>
            <div>Телефон: {value.sourceAddr} </div>
            <div>Текст: {value.message} </div>
            <br />
          </div>
        ))}
    </>
  );
}

export { Messages };
