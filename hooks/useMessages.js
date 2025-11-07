import { useCRUD } from "./useCRUD";

export function useMessages() {
  const { data, isLoading, isError, mutate, create, update, remove } = useCRUD(
    "messages",
    ["messages"],
    "message",
  );

  // Alias pour maintenir la compatibilité avec l'API existante
  const createMessage = create;
  const updateMessage = update;
  const deleteMessage = remove;

  return {
    messages: data,
    isLoading,
    isError,
    mutate,
    createMessage,
    updateMessage,
    deleteMessage,
  };
}
