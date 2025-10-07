import { useEffect, useState } from "react";
import { MessageSquare, Edit2, Trash2, Send, X, Check } from "lucide-react";
import { apiUrl } from "../config/api";

export default function Comments({ postId, user, token }) {
  const [comments, setComments] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [editContent, setEditContent] = useState("");

  // fetch comments
  useEffect(() => {
    if (postId) {
      fetch((`${apiUrl()}/api/comments/${postId}`), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(setComments)
        .catch(err => console.error("Error fetching comments", err));
    }
  }, [postId, token]);

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    const res = await fetch((`${apiUrl()}/api/comments/${postId}`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newContent }),
    });
    const cmt = await res.json();
    setComments([...comments, cmt]);
    setNewContent("");
  };

  const handleDelete = async (commentId, userId) => {
    if (user.role !== "admin" && user.id !== userId) return alert("Not allowed");

    await fetch((`${apiUrl()}/api/comments/${postId}/${commentId}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleUpdate = async (commentId, userId) => {
    if (user.role !== "admin" && user.id !== userId) return alert("Not allowed");

    const res = await fetch((`${apiUrl()}/api/comments/${postId}/${commentId}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editContent }),
    });
    const updated = await res.json();
    setComments(comments.map(c => (c.id === commentId ? updated : c)));
    setEditing(null);
  };

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Comments ({comments.length})
      </h4>

      <div className="space-y-3 mb-4">
        {comments.map(c => (
          <div key={c.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            {editing === c.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(c.id, c.userId)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h6 className="text-gray-900 mb-2  font-bold">{c.authorName || c.userId}</h6>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{c.content}</span>
                  {(user.role === "admin" || user.id === c.userId) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditing(c.id); setEditContent(c.content); }}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.userId)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={e => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );
}
