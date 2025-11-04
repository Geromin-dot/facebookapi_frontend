const API_BASE = "postgresql://facebook_db_user:cp3fnN6pPVie2wAmAq12MPras3JzSsT7@dpg-d44mjc7gi27c73ad3dcg-a/facebook_db";

export async function getPosts() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to load posts");
  return await res.json();
}

export async function createPost(post) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return await res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
}
