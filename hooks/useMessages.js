import { useCRUD } from "./useCRUD";
import { toast } from "../lib/toastUtils";

export function useMessages() {
  const { data, isLoading, isError, mutate, create, update, remove } = useCRUD(
    "messages",
    ["messages"],
    "message",
  );

  // Alias avec toasts pour maintenir la compatibilité avec l'API existante
  const createMessage = async (messageData) => {
    try {
      await create(messageData);
      toast.success(
        "Message créé",
        "Le message a été envoyé avec succès."
      );
    } catch (error) {
      console.error("Failed to create message:", error);
      toast.error(
        "Erreur d'envoi",
        "Impossible d'envoyer le message. Vérifiez votre connexion."
      );
      throw error;
    }
  };

  const updateMessage = async (messageId, updatedData) => {
    try {
      await update(messageId, updatedData);
      toast.success(
        "Message mis à jour",
        "Le message a été mis à jour avec succès."
      );
    } catch (error) {
      console.error("Failed to update message:", error);
      toast.error(
        "Erreur de mise à jour",
        "Impossible de mettre à jour le message. Réessayez plus tard."
      );
      throw error;
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await remove(messageId);
      toast.success(
        "Message supprimé",
        "Le message a été définitivement supprimé."
      );
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error(
        "Erreur de suppression",
        "Impossible de supprimer le message. Vérifiez vos permissions."
      );
      throw error;
    }
  };

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
