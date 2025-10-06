import { Check, X } from "lucide-react";

export default function EditForm({
  post,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  handleUpdate,
  setEditing,
}) {
  return (
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
  );
}
