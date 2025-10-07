import { useEffect, useState } from "react";

import CreatePostBox from "./CreatePostBox";
import PostCard from "./PostCard";
import Comments from "./Comments";
import { apiUrl } from "../config/api";

export default function Posts({ user, token }) {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  // fetch posts
  useEffect(() => {
    fetch(apiUrl("/api/posts"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setPosts)
      .catch((err) => console.error("Error fetching posts", err));
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">📌 Posts</h2>
          <p className="text-gray-600 text-lg">
            Welcome back,{" "}
            <span className="font-semibold text-indigo-600">{user.name}</span>
          </p>
        </div>

        {/* Create Post */}
        <CreatePostBox posts={posts} setPosts={setPosts} token={token} />

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length > 0 &&
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                user={user}
                token={token}
                posts={posts}
                setPosts={setPosts}
                selected={selected}
                setSelected={setSelected}
                editing={editing}
                setEditing={setEditing}
              >
                {selected === post.id && (
                  <Comments postId={post.id} user={user} token={token} />
                )}
              </PostCard>
            ))}
        </div>
      </div>
    </div>
  );
}
