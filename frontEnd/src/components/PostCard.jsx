import { Edit2, Trash2, MessageSquare } from "lucide-react";
import swal from "sweetalert";
import EditForm from "./EditForm";
import { useState } from "react";

export default function PostCard({
  post,
  user,
  token,
  posts,
  setPosts,
  selected,
  setSelected,
  editing,
  setEditing,
  children,
}) {
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  const handleDelete = async (id, authorId) => {
    if (user.role !== "admin" && user.id !== authorId)
      return swal("Not allowed ❌");

    const res = await fetch(`http://localhost:2000/api/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== id));
      if (selected === id) setSelected(null);
      swal("You have deleted the post successfully ✅", { icon: "success" });
    } else {
      alert(data.message || "Failed to delete");
    }
  };

  const handelDeleteSubmit = (postId, userId) => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to Delete this Post?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        handleDelete(postId, userId);
      } else {
        swal("Delete canceled 🚫");
      }
    });
  };

  const handleUpdate = async (id, authorId) => {
    if (user.role !== "admin" && user.id !== authorId)
      return alert("Not allowed");

    const res = await fetch(`http://localhost:2000/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });

    const updated = await res.json();
    if (res.ok) {
      setPosts(posts.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      setEditing(null);
    } else {
      alert(updated.message || "Failed to update");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-transform hover:-translate-y-1">
      <div className="p-6">
        {editing === post.id ? (
          <EditForm
            post={post}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editContent={editContent}
            setEditContent={setEditContent}
            handleUpdate={handleUpdate}
            setEditing={setEditing}
            user={user}
            token={token}
          />
        ) : (
          <>
            {/* Author */}
            <div className="flex items-center space-x-3">
              <img
                src={post.userImageUrl}
                alt={post.authorName}
                className="w-12 h-12 rounded-full object-cover shadow"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {post.authorName}
              </h3>
            </div>
            <span className="text-gray-400 text-xs">
              {new Date(post.createdAt).toLocaleString()}
            </span>

            {/* Content */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <h1 className="text-gray-700 mb-4 leading-relaxed text-2xl">
                {post.content}
              </h1>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="w-full max-h-96 object-cover rounded-lg border"
                />
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                {(user.role === "admin" || user.id === post.authorId) && (
                  <>
                    <button
                      onClick={() => setEditing(post.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handelDeleteSubmit(post.id, post.authorId)}
                      className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
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
                  className="flex items-center gap-1 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  {selected === post.id ? "Hide" : "Comments"}
                </button>
              </div>
            </div>
            {children}
          </>
        )}
      </div>
    </div>
  );
}
