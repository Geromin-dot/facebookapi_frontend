import React, { useEffect, useState } from "react";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { getPosts, deletePost, createPost, updatePost } from "./api";
import "./App.css";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
    // Assuming you have a way to trigger a refresh after creating a post, 
    // you can use an event listener or pass loadPosts to PostForm
    window.addEventListener("posts:updated", loadPosts);
    return () => window.removeEventListener("posts:updated", loadPosts);
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      await loadPosts();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  }

  async function handleSave(updatedPost) {
    try {
      await updatePost(updatedPost.id, updatedPost); 
      await loadPosts(); // THIS IS THE KEY: Reloads posts into App's state, refreshing PostList
    } catch (err) {
      alert("Failed to update post: " + err.message);
    }
  }

  return (
    <>
      <div className="topbar">
        <h1>Facebook-like Posts</h1>
      </div>

      <div className="container">
        <main className="left">
          <div className="card post-form">
            <h3>Create post</h3>
            {/* You will need to pass a way to refresh posts to PostForm, e.g., onPostCreated={loadPosts} */}
            <PostForm />
          </div>
        </main>

        <section className="right">
          {/* Pass ALL state and handlers to PostList */}
          <PostList
            posts={posts} 
            loading={loading}
            error={error}
            handleDelete={handleDelete}
            handleSave={handleSave} 
          />
        </section>
      </div>

      <footer className="footer">
        <p>
          built with ❤️ — <strong>facebook-posts-ui</strong>
        </p>
      </footer>
    </>
  );
}