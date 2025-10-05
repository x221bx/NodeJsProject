import { useEffect, useState } from "react";
import {
  MessageSquare,
  Edit2,
  Trash2,
  X,
  Check,
  PlusCircle,
} from "lucide-react";
import Comments from "./comment";

export default function Posts({ user, token }) {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // fetch posts
  useEffect(() => {
    fetch("http://localhost:3000/api/posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setPosts)
      .catch((err) => console.error("Error fetching posts", err));
  }, [token]);

const handleDelete = async (id, authorId) => {
  if (user.role !== "admin" && user.id !== authorId)
    return alert("Not allowed");

  const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.ok) {
    setPosts(posts.filter((p) => p.id !== id));
    if (selected === id) setSelected(null);
  } else {
    alert(data.message || "Failed to delete");
  }
};


  const handleUpdate = async (id, authorId) => {
    if (user.role !== "admin" && user.id !== authorId)
      return alert("Not allowed");

    const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });

    const updated = await res.json();
    setPosts(posts.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    setEditing(null);
  };

  const handleCreate = async () => {
    if (!newTitle || !newContent) return alert("Please fill all fields");

    const res = await fetch(`http://localhost:3000/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });

    const newPost = await res.json();

    if (newPost && newPost.id) {
      setPosts([newPost, ...posts]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
            📌 Posts
          </h2>
          <p className="text-gray-600 text-lg">
            Welcome back,{" "}
            <span className="font-semibold text-indigo-600">{user.name}</span>
          </p>
        </div>

        {/* 🔹 Create Post Box */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Create a new post
          </h3>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full p-4 mb-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write something..."
            rows="4"
            className="w-full p-4 mb-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={() => {
              handleCreate();
              setNewTitle("");
              setNewContent("");
            }}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Publish
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length > 0 &&
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/80 backdrop-blur rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {editing === post.id ? (
                    <div className="space-y-4">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-4 text-xl font-semibold border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Title"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows="4"
                        placeholder="Content"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdate(post.id, post.authorId)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                        >
                          <Check className="w-5 h-5" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {post.authorName}
                      </h3>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            ✍ {post.authorId === user.id ? "You" : post.authorName}
                          </span>
                          <span className="text-gray-400">
                            {new Date(post.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {(user.role === "admin" ||
                            user.id === post.authorId) && (
                            <>
                              <button
                                onClick={() => {
                                  setEditing(post.id);
                                  setEditTitle(post.title);
                                  setEditContent(post.content);
                                }}
                                className="flex items-center gap-1 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(post.id, post.authorId);
                                }}
                                className="flex items-center gap-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </>
                          )}
                          <button
                            onClick={() =>
                              setSelected(selected === post.id ? null : post.id)
                            }
                            className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {selected === post.id ? "Hide" : "Comments"}
                          </button>
                        </div>
                      </div>

                      {selected === post.id && (
                        <Comments postId={post.id} user={user} token={token} />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
