import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL_DAY_2;

function PostManager() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postForm, setPostForm] = useState({ title: "", content: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [commentForm, setCommentForm] = useState({ postId: "", content: "" });
  const [editingComment, setEditingComment] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError("Lỗi khi tải posts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError("Lỗi khi tải comments: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, []);

  const createPost = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }
      setPostForm({ title: "", content: "" });
      fetchPosts();
      alert("Tạo post thành công!");
    } catch (err) {
      setError("Lỗi khi tạo post: " + err.message);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch(`${API_URL}/posts/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update post");
      }
      setPostForm({ title: "", content: "" });
      setEditingPost(null);
      fetchPosts();
      alert("Cập nhật post thành công!");
    } catch (err) {
      setError("Lỗi khi cập nhật post: " + err.message);
    }
  };

  const deletePost = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa post này?")) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete post");
      }
      fetchPosts();
      alert("Xóa post thành công!");
    } catch (err) {
      setError("Lỗi khi xóa post: " + err.message);
    }
  };

  const createComment = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: Number(commentForm.postId),
          content: commentForm.content,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create comment");
      }
      setCommentForm({ postId: "", content: "" });
      fetchComments();
      alert("Tạo comment thành công!");
    } catch (err) {
      setError("Lỗi khi tạo comment: " + err.message);
    }
  };

  const updateComment = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch(`${API_URL}/comments/${editingComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentForm.content }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update comment");
      }
      setCommentForm({ postId: "", content: "" });
      setEditingComment(null);
      fetchComments();
      alert("Cập nhật comment thành công!");
    } catch (err) {
      setError("Lỗi khi cập nhật comment: " + err.message);
    }
  };

  const deleteComment = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa comment này?")) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/comments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete comment");
      }
      fetchComments();
      alert("Xóa comment thành công!");
    } catch (err) {
      setError("Lỗi khi xóa comment: " + err.message);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({ title: post.title, content: post.content });
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setCommentForm({ postId: comment.postId, content: comment.content });
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditingComment(null);
    setPostForm({ title: "", content: "" });
    setCommentForm({ postId: "", content: "" });
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5 border-l-4 border-red-600">
          {error}
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-4 border-blue-500 pb-2">
          Posts Management
        </h2>

        <form
          onSubmit={editingPost ? updatePost : createPost}
          className="bg-white p-5 rounded-lg mb-6 shadow"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {editingPost ? "Cập nhật Post" : "Tạo Post Mới"}
          </h3>
          <input
            type="text"
            placeholder="Title (tối thiểu 3 ký tự)"
            value={postForm.title}
            onChange={(e) =>
              setPostForm({ ...postForm, title: e.target.value })
            }
            required
            minLength={3}
            maxLength={200}
            className="w-full p-3 mb-4 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="Content (tối thiểu 10 ký tự)"
            value={postForm.content}
            onChange={(e) =>
              setPostForm({ ...postForm, content: e.target.value })
            }
            required
            minLength={10}
            maxLength={5000}
            rows={4}
            className="w-full p-3 mb-4 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none resize-y"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition"
            >
              {editingPost ? "Cập nhật" : "Tạo mới"}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        <div className="mt-5">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Danh sách Posts ({posts.length})
          </h3>
          {loading && <p>Đang tải...</p>}
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg mb-3 flex justify-between items-start shadow hover:shadow-lg transition"
            >
              <div className="flex-1 mr-4">
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {post.title}
                </h4>
                <p className="text-gray-600 mb-2 leading-relaxed">
                  {post.content}
                </p>
                <small className="text-gray-400 text-xs">ID: {post.id}</small>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEditPost(post)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Sửa
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-4 border-blue-500 pb-2">
          Comments Management
        </h2>

        <form
          onSubmit={editingComment ? updateComment : createComment}
          className="bg-white p-5 rounded-lg mb-6 shadow"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {editingComment ? "Cập nhật Comment" : "Tạo Comment Mới"}
          </h3>
          {!editingComment && (
            <input
              type="number"
              placeholder="Post ID"
              value={commentForm.postId}
              onChange={(e) =>
                setCommentForm({ ...commentForm, postId: e.target.value })
              }
              required
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            />
          )}
          <textarea
            placeholder="Content (tối thiểu 1 ký tự, tối đa 500 ký tự)"
            value={commentForm.content}
            onChange={(e) =>
              setCommentForm({ ...commentForm, content: e.target.value })
            }
            required
            minLength={1}
            maxLength={500}
            rows={3}
            className="w-full p-3 mb-4 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none resize-y"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition"
            >
              {editingComment ? "Cập nhật" : "Tạo mới"}
            </button>
            {editingComment && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        <div className="mt-5">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Danh sách Comments ({comments.length})
          </h3>
          {loading && <p>Đang tải...</p>}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4 rounded-lg mb-3 flex justify-between items-start shadow hover:shadow-lg transition"
            >
              <div className="flex-1 mr-4">
                <p className="text-gray-600 mb-2 leading-relaxed">
                  {comment.content}
                </p>
                <small className="text-gray-400 text-xs">
                  ID: {comment.id} | Post ID: {comment.postId}
                </small>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEditComment(comment)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostManager;
