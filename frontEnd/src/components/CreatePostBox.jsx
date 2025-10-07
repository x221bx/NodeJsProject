import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { apiUrl } from "../config/api";

export default function CreatePostBox({ posts, setPosts, token }) {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [file, setFile] = useState(null);

  const handleCreate = async () => {
    if (!newTitle || !newContent) return alert("Please fill all fields");

    const fd = new FormData();
    fd.append("title", newTitle);
    fd.append("content", newContent);
    if (file) fd.append("image", file);

    const res = await fetch(apiUrl(`/api/posts`), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const newPost = await res.json();

    if (res.ok && newPost?.id) {
      setPosts([newPost, ...posts]);
      setNewTitle("");
      setNewContent("");
      setFile(null);
    } else {
      alert(newPost.message || "Failed to create post");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Create a new post</h3>
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
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleCreate}
        className="flex items-center gap-2 px-5 py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
      >
        <PlusCircle className="w-5 h-5" />
        Publish
      </button>
    </div>
  );
}
