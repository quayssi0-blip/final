import { useCRUD } from "./useCRUD";

export function useBlogs() {
  const { data, isLoading, isError, mutate, create, update, remove } = useCRUD(
    "blog_posts",
    ["blog_posts"],
    "blog",
  );

  // Alias pour maintenir la compatibilité avec l'API existante
  const createBlog = create;
  const updateBlog = update;
  const deleteBlog = remove;

  return {
    blogs: data,
    isLoading,
    isError,
    mutate,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
