import { useState } from 'react';
import './Settings.css';

const Settings = () => {
  // Profile
  const [ownerName, setOwnerName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav.s@bhaktimart.in');
  const [phone, setPhone] = useState('+91 98765 43210');

  // Shop
  const [shopName, setShopName] = useState('Bhakti Mart Handicrafts');
  const [specialization, setSpecialization] = useState('Brass Artifacts');
  const [shopAddress, setShopAddress] = useState('Gali No. 4, Marble Market, Alwar, Rajasthan - 301001');
  const [shopDescription, setShopDescription] = useState('Specializing in exquisite brass Murtis and home decor items since 1995. Our artisans focus on traditional methods to bring divine energy to your home.');

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    alert('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Account Settings</h1>
        <p className="settings-subtitle">Manage your personal profile, shop identity, and security preferences.</p>
      </div>

      {/* Profile Settings */}
      <section className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <h2>Profile Settings</h2>
          </div>
          <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        <div className="profile-section">
          <div className="profile-avatar-area">
            <div className="profile-avatar">
              <span>AS</span>
            </div>
            <button className="avatar-camera-btn" aria-label="Change avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
          </div>
          <div className="profile-fields">
            <div className="field-row">
              <div className="field-group">
                <label>Owner Name</label>
                <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              </div>
              <div className="field-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Settings */}
      <section className="settings-card">
        <div className="settings-card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <h2>Shop Settings</h2>
        </div>

        <div className="shop-logo-area">
          <div className="shop-logo-preview">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
          <div className="shop-logo-info">
            <h4>Shop Logo</h4>
            <p>PNG or JPG up to 5MB. Recommended size 400x400px.</p>
            <div className="shop-logo-actions">
              <button className="upload-btn">Upload New</button>
              <button className="remove-btn">Remove</button>
            </div>
          </div>
        </div>

        <div className="field-row">
          <div className="field-group">
            <label>Shop Name</label>
            <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} />
          </div>
          <div className="field-group">
            <label>Specialization</label>
            <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
              <option>Brass Artifacts</option>
              <option>Marble Murtis</option>
              <option>Stone Carvings</option>
              <option>Wood Carvings</option>
              <option>Clay & Terracotta</option>
              <option>Metal Crafts</option>
              <option>Resin Murtis</option>
            </select>
          </div>
        </div>

        <div className="field-group full-width">
          <label>Shop Address</label>
          <input type="text" value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} />
        </div>

        <div className="field-group full-width">
          <label>Shop Description</label>
          <textarea rows="4" value={shopDescription} onChange={(e) => setShopDescription(e.target.value)} />
        </div>
      </section>

      {/* Change Password */}
      <section className="settings-card">
        <div className="settings-card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h2>Change Password</h2>
        </div>

        <form onSubmit={handleUpdatePassword}>
          <div className="field-group" style={{ maxWidth: 400 }}>
            <label>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="field-group">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="update-password-btn">Update Password</button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="settings-card danger-card">
        <div className="settings-card-title danger-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <h2>Danger Zone</h2>
        </div>

        <div className="danger-item">
          <div>
            <h4>Deactivate Shop</h4>
            <p>Temporarily hide your shop and all listings from customers. You can reactivate anytime.</p>
          </div>
          <button className="deactivate-btn">Deactivate Shop</button>
        </div>

        <div className="danger-item">
          <div>
            <h4 className="danger-red">Delete Account</h4>
            <p>Permanently remove your account, shop data, and history. This action cannot be undone.</p>
          </div>
          <button className="delete-btn">Delete Everything</button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
