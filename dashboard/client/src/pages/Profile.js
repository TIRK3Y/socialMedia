import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './component/Navigation.jsx';

export default function Profile() {
  const navigate = useNavigate();

  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  };

  const [user, setUser] = useState(getUserFromStorage());
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setForm(user);
    if (user.photo) {
      setPreview(
        user.photo.startsWith('data:image') ? user.photo : `data:image/jpeg;base64,${user.photo}`
      );
    } else {
      setPreview('');
    }
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/posts/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setPosts(data.posts || []);
      } catch {
        console.error('Failed to load posts');
      }
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSnackbar('Please select a valid image file', 'error');
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 3000);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showSnackbar('Not authenticated', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name || '');
    if (form.phone) formData.append('phone', form.phone);
    if (form.role) formData.append('role', form.role);
    if (form.bio) formData.append('bio', form.bio);
    if (imageFile) formData.append('photo', imageFile);

    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setEditMode(false);
        setImageFile(null);
        showSnackbar('Profile updated successfully', 'success');
      } else {
        showSnackbar(data.message || 'Failed to update profile', 'error');
      }
    } catch {
      showSnackbar('Network error', 'error');
    }
  };

  const handleLogout = () => setLogoutDialogOpen(true);

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLogoutDialogOpen(false);
    showSnackbar('Logged out successfully', 'info');
    setTimeout(() => navigate('/login'), 1500);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setForm(user);
    setImageFile(null);
    setPreview(
      user.photo
        ? user.photo.startsWith('data:image')
          ? user.photo
          : `data:image/jpeg;base64,${user.photo}`
        : ''
    );
  };

  return (
    <>
    <Navigation />
      <nav className="nav-bar">
        <h1>MyApp</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="profile-container">
        <section className="profile-header">
          <div className="avatar-wrapper">
            <img className="avatar" src={preview || '/default-avatar.png'} alt={form.name || 'User'} />
            {editMode && (
              <label className="upload-label">
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                Change Photo
              </label>
            )}
          </div>
          <div className="profile-info">
            {!editMode ? (
              <>
                <h2 className="profile-name">{user.name || 'No Name'}</h2>
                <p className="profile-username">@{user.email?.split('@')[0] || 'user'}</p>
              </>
            ) : (
              <input
                className="input-name"
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                required
              />
            )}
          </div>
          <div className="edit-button-wrapper">
            {!editMode ? (
              <button className="btn btn-edit" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            ) : (
              <>
                <button className="btn btn-save" onClick={handleSave}>Save</button>
                <button className="btn btn-cancel" onClick={cancelEdit}>Cancel</button>
              </>
            )}
          </div>
        </section>

        <section className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email || 'Not provided'}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            {editMode ? (
              <input
                className="input-detail"
                name="phone"
                type="tel"
                value={form.phone || ''}
                onChange={handleChange}
                maxLength={15}
              />
            ) : (
              <span className="detail-value">{user.phone || '-'}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Role:</span>
            {editMode ? (
              <input
                className="input-detail"
                name="role"
                value={form.role || ''}
                onChange={handleChange}
              />
            ) : (
              <span className="detail-value">{user.role || '-'}</span>
            )}
          </div>

          <div className="detail-row bio-row">
            <span className="detail-label">Bio:</span>
            {editMode ? (
              <textarea
                className="input-bio"
                name="bio"
                value={form.bio || ''}
                onChange={handleChange}
                rows={3}
              />
            ) : (
              <p className="bio-text">{user.bio || 'No bio provided.'}</p>
            )}
          </div>
        </section>

        <section className="posts-section">
          <h3>Your Posts</h3>
          <div className="posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post._id} className="post-card">
                  <h4 className="post-title">{post.title}</h4>
                  <p className="post-content">{post.content}</p>
                </article>
              ))
            ) : (
              <p>No posts yet.</p>
            )}
          </div>
        </section>

        {logoutDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h4>Confirm Logout</h4>
              <p>Are you sure you want to log out?</p>
              <div className="dialog-actions">
                <button className="btn btn-cancel" onClick={() => setLogoutDialogOpen(false)}>Cancel</button>
                <button className="btn btn-logout" onClick={confirmLogout}>Logout</button>
              </div>
            </div>
          </div>
        )}

        {snackbar.open && (
          <div className={`snackbar snackbar-${snackbar.severity}`}>
            {snackbar.message}
          </div>
        )}
      </main>

      <style>{`
        /* Reset */
        * {
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          background: #fafafa;
          color: #262626;
        }

        .nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: white;
          border-bottom: 1px solid #dbdbdb;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-bar h1 {
          font-weight: 600;
          font-size: 22px;
          color: #262626;
        }

        .logout-btn {
          background: none;
          border: none;
          color: #0095f6;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }

        .profile-container {
          max-width: 750px;
          margin: 30px auto;
          background: white;
          border: 1px solid #dbdbdb;
          padding: 30px;
          border-radius: 8px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 40px;
          border-bottom: 1px solid #dbdbdb;
          padding-bottom: 20px;
        }

        .avatar-wrapper {
          position: relative;
        }

        .avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #dbdbdb;
          background: #efefef;
        }

        .upload-label {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #0095f6;
          color: white;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 20px;
          cursor: pointer;
          user-select: none;
          font-weight: 600;
          border: 2px solid white;
          transition: background 0.3s ease;
        }
        .upload-label:hover {
          background: #0077cc;
        }

        .profile-info {
          flex-grow: 1;
        }

        .profile-name {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }

        .profile-username {
          font-size: 16px;
          color: #8e8e8e;
          margin-top: 4px;
          font-weight: 400;
        }

        .input-name {
          font-size: 28px;
          font-weight: 600;
          padding: 6px 8px;
          width: 100%;
          border: 1px solid #dbdbdb;
          border-radius: 4px;
        }

        .edit-button-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn {
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          padding: 8px 18px;
          font-size: 14px;
          user-select: none;
          transition: background-color 0.2s ease;
        }

        .btn-edit {
          background: #0095f6;
          color: white;
        }
        .btn-edit:hover {
          background: #0077cc;
        }

        .btn-save {
          background: #0095f6;
          color: white;
        }
        .btn-save:hover {
          background: #0077cc;
        }

        .btn-cancel {
          background: #efefef;
          color: #262626;
        }
        .btn-cancel:hover {
          background: #d3d3d3;
        }

        .btn-logout {
          background: #ed4956;
          color: white;
        }
        .btn-logout:hover {
          background: #c53844;
        }

        .profile-details {
          margin-top: 30px;
          font-size: 16px;
          color: #262626;
        }

        .detail-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .detail-label {
          font-weight: 600;
          min-width: 80px;
          color: #8e8e8e;
        }

        .detail-value {
          flex-grow: 1;
          word-break: break-word;
        }

        .input-detail {
          flex-grow: 1;
          padding: 6px 8px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #dbdbdb;
          outline-offset: 2px;
        }

        .bio-row {
          flex-direction: column;
        }

        .bio-text {
          margin-top: 6px;
          line-height: 1.4;
          color: #262626;
          white-space: pre-wrap;
          min-height: 60px;
        }

        .input-bio {
          width: 100%;
          padding: 6px 8px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #dbdbdb;
          resize: vertical;
          outline-offset: 2px;
          min-height: 60px;
          font-family: inherit;
        }

        .posts-section {
          margin-top: 50px;
       
      }
              .posts-section h3 {
      font-weight: 600;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
      gap: 20px;
    }

    .post-card {
      background: #fafafa;
      border: 1px solid #dbdbdb;
      padding: 14px 16px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
    }

    .post-title {
      margin: 0 0 8px 0;
      font-weight: 600;
      font-size: 16px;
      color: #262626;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .post-content {
      margin: 0;
      font-size: 14px;
      color: #555;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Snackbar */
    .snackbar {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 14px;
      opacity: 0.95;
      z-index: 9999;
      user-select: none;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .snackbar-info {
      background: #2196f3;
    }
    .snackbar-success {
      background: #4caf50;
    }
    .snackbar-error {
      background: #f44336;
    }

    /* Dialog */
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    }

    .dialog {
      background: white;
      border-radius: 8px;
      padding: 24px 30px;
      width: 320px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.2);
      text-align: center;
    }

    .dialog h4 {
      margin-top: 0;
      margin-bottom: 12px;
      font-weight: 700;
      font-size: 20px;
      color: #262626;
    }

    .dialog p {
      margin: 0 0 24px;
      color: #555;
      font-size: 16px;
    }

    .dialog-actions {
      display: flex;
      justify-content: space-around;
      gap: 20px;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .profile-container {
        margin: 15px;
        padding: 20px;
      }
      .profile-header {
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      .profile-info {
        text-align: center;
      }
      .edit-button-wrapper {
        flex-direction: row;
        gap: 12px;
        justify-content: center;
        width: 100%;
      }
      .posts-grid {
        grid-template-columns: repeat(auto-fill,minmax(150px,1fr));
      }
    }
  `}</style>
</>
);
}