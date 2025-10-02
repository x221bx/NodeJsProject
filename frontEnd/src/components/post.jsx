import { useEffect, useState } from "react";
import { MessageSquare, Edit2, Trash2, X, Check } from "lucide-react";
import Comments from "./comment";

export default function Posts({ user, token }) {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // fetch posts
  useEffect(() => {
    fetch("http://localhost:3000/api/posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setPosts)
      .catch(err => console.error("Error fetching posts", err));
  }, [token]);

  const handleDelete = async (id, authorId) => {
    if (user.role !== "admin" && user.id !== authorId) return alert("Not allowed");

    await fetch(`http://localhost:3000/api/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setPosts(posts.filter(p => p.id !== id));
    if (selected === id) setSelected(null);
  };

  const handleUpdate = async (id, authorId) => {
    if (user.role !== "admin" && user.id !== authorId) return alert("Not allowed");

    const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });

    const updated = await res.json();
    setPosts(posts.map(p => (p.id === id ? { ...p, ...updated } : p)));
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Posts</h2>
          <p className="text-gray-600">Welcome, {user.name}</p>
        </div>

        <div className="space-y-4">
          {posts.length > 0&& posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                {editing === post.id ? (
                  <div className="space-y-4">
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full p-3 text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Title"
                    />
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="Content"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(post.id, post.authorId)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        <Check className="w-5 h-5" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          Author: {post.authorId === user.id ? "You" : post.authorId}
                        </span>
                        <span className="text-sm text-gray-400">{post.createdAt}</span>
                      </div>

                      <div className="flex gap-2">
                        {(user.role === "admin" || user.id === post.authorId) && (
                          <>
                            <button
                              onClick={() => {
                                setEditing(post.id);
                                setEditTitle(post.title);
                                setEditContent(post.content);
                              }}
                              className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(post.id, post.authorId)}
                              className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelected(selected === post.id ? null : post.id)}
                          className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {selected === post.id ? "Hide Comments" : "View Comments"}
                        </button>
                      </div>
                    </div>

                    {selected === post.id && <Comments postId={post.id} user={user} token={token} />}
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
