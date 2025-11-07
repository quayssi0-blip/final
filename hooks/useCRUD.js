import useSWR from "swr";
import { supabaseClient } from "../lib/supabaseClient";
import { supabaseFetcher } from "../lib/supabaseFetcher";

/**
 * Hook générique CRUD pour les tables Supabase
 * @param {string} tableName - Le nom de la table Supabase
 * @param {string} swrKey - La clé SWR (par défaut: [tableName])
 * @param {string} entityName - Le nom de l'entité pour les messages d'erreur (par défaut: 'entity')
 * @returns {Object} - Objet contenant les données et les fonctions CRUD
 */
export function useCRUD(tableName, swrKey = null, entityName = "entity") {
  const key = swrKey || [tableName];
  const { data, error, isLoading, mutate } = useSWR(key, supabaseFetcher);

  /**
   * Crée un nouvel enregistrement
   * @param {Object} entityData - Les données de l'entité à créer
   */
  const create = async (entityData) => {
    const { error: createError } = await supabaseClient
      .from(tableName)
      .insert([entityData]);
    if (createError) {
      console.error(`Failed to create ${entityName}:`, createError);
      throw new Error(`Could not create ${entityName}.`);
    }
    mutate(); // Revalidate
  };

  /**
   * Met à jour un enregistrement
   * @param {string|number} entityId - L'ID de l'entité à mettre à jour
   * @param {Object} updatedData - Les données mises à jour
   */
  const update = async (entityId, updatedData) => {
    const { error: updateError } = await supabaseClient
      .from(tableName)
      .update(updatedData)
      .eq("id", entityId);
    if (updateError) {
      console.error(`Failed to update ${entityName}:`, updateError);
      throw new Error(`Could not update ${entityName}.`);
    }
    mutate(); // Revalidate
  };

  /**
   * Supprime un enregistrement
   * @param {string|number} entityId - L'ID de l'entité à supprimer
   */
  const remove = async (entityId) => {
    const { error: deleteError } = await supabaseClient
      .from(tableName)
      .delete()
      .eq("id", entityId);
    if (deleteError) {
      console.error(`Failed to delete ${entityName}:`, deleteError);
      throw new Error(`Could not delete ${entityName}.`);
    }
    mutate(); // Revalidate
  };

  return {
    // Les données principales
    data: data,
    // État de chargement et d'erreur
    isLoading,
    isError: error,
    // Fonction de revalidation
    mutate,
    // Fonctions CRUD
    create,
    update,
    remove,
  };
}
