import React from "react";
import Content from './content'
import { TaskDetailsProvider } from "@/hooks/useTaskDetails";

type tParams = Promise<{ id: string }>;

export default async function TaskDetailPage(props: { params: tParams }) {
  const { id } = await props.params;

  return (
    <TaskDetailsProvider tokenId={String(id)}>
      <Content id={id} />
    </TaskDetailsProvider>
  );
}
