
import { useEffect, useState } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import api from "../services/api";

const TicketComments = ({ ticketId }) => {

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const fetchComments = async () => {
    try {
      const { data } = await api.get(
        `/comments/${ticketId}`
      );

      setComments(data.comments);

    } catch (err) {
      setError("Unable to load comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      setLoading(true);
      setError("");

      await api.post(`/comments/${ticketId}`, {
        text
      });

      setText("");

      await fetchComments();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to add comment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comments/${commentId}`);
      await fetchComments();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete comment"
      );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="text-yellow-400" />
        <h3 className="text-white font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          maxLength={2000}
          className="flex-1 min-w-0 bg-slate-800 text-white rounded-lg px-4 py-3 outline-none"
        />

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="bg-yellow-400 text-black px-4 rounded-lg disabled:opacity-50"
        >
          <Send size={18} />
        </button>

      </form>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      <div className="space-y-4">

        {comments.map(comment => {

          const isOwner =
            comment.userId?._id === currentUser?.id ||
            comment.userId?._id === currentUser?._id;

          return (
            <div
              key={comment._id}
              className="border-b border-slate-800 pb-4"
            >

              <div className="flex justify-between gap-3">

                <div>
                  <p className="text-white font-medium text-sm">
                    {comment.userId?.name || "User"}
                  </p>

                  <p className="text-slate-500 text-xs mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>

                {isOwner && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-slate-500 hover:text-red-400"
                    title="Delete comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

              </div>

              <p className="text-slate-300 text-sm mt-3 break-words">
                {comment.text}
              </p>

            </div>
          );
        })}

        {comments.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-5">
            No comments yet.
          </p>
        )}

      </div>

    </div>
  );
};

export default TicketComments;
