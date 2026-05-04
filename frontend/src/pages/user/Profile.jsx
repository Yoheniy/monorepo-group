import { useEffect, useState } from 'react';
import { 
  User, Mail, Briefcase, Building, IdCard, Shield, 
  Loader2, AlertCircle, CheckCircle, Calendar,
  Edit, Key, Lock, LogOut, Download, Phone, MapPin,
  X, Eye, EyeOff, Check, Globe, Bell, Shield as PrivacyShield,
  Save, Zap, Sparkles, Trophy, Crown, Target, Users, Star,
  TrendingUp, BarChart3, Award, ChevronRight, Share2, Settings,
  ShieldCheck, Database, Cpu, Rocket, Cloud, Fingerprint,
  Verified, QrCode, ShieldAlert, Network, Cpu as Chip,
  Wifi, WifiOff, Server, HardDrive
} from 'lucide-react';

// Modal Components with Futuristic Design
const EditProfileModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    department: user?.department || '',
    studentId: user?.studentId || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/10">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <p className="text-gray-400 text-sm mt-1">Update your personal information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all group-hover:border-cyan-500/50"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all group-hover:border-cyan-500/50"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Department */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Department
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all group-hover:border-cyan-500/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Student ID */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Student ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all group-hover:border-cyan-500/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Phone */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all group-hover:border-cyan-500/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2 group">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Address
              </label>
              <div className="relative">
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none group-hover:border-cyan-500/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChangePasswordModal = ({ isOpen, onClose, onChangePassword }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }

    if (passwords.new.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await onChangePassword(passwords.current, passwords.new);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-2xl w-full max-w-md shadow-2xl shadow-purple-500/10">
        {/* Modal Header */}
        <div className="border-b border-gray-700/50 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Change Password</h2>
            <p className="text-gray-400 text-sm mt-1">Update your password securely</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Current Password */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12 group-hover:border-purple-500/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* New Password */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12 group-hover:border-purple-500/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12 group-hover:border-purple-500/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Password Requirements
            </h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                At least 6 characters long
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Include uppercase and lowercase letters
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Include numbers or special characters
              </li>
            </ul>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PrivacySettingsModal = ({ isOpen, onClose, user }) => {
  const [settings, setSettings] = useState({
    profileVisibility: user?.profileVisibility || 'public',
    emailVisibility: user?.emailVisibility || 'private',
    showOnlineStatus: user?.showOnlineStatus || true,
    allowTagging: user?.allowTagging || true,
    dataSharing: user?.dataSharing || 'limited',
    notifications: {
      email: user?.notifications?.email || true,
      push: user?.notifications?.push || true,
      security: user?.notifications?.security || true
    }
  });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/privacy-settings', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (!res.ok) throw new Error('Failed to update privacy settings');
      alert('Privacy settings updated successfully!');
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-500/10">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Privacy Settings</h2>
            <p className="text-gray-400 text-sm mt-1">Control your privacy and data preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Visibility */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-400" />
              Profile Visibility
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div>
                  <p className="font-medium text-white">Profile Visibility</p>
                  <p className="text-sm text-gray-400">Who can see your profile</p>
                </div>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({...settings, profileVisibility: e.target.value})}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                >
                  <option value="public">Public</option>
                  <option value="contacts">Contacts Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div>
                  <p className="font-medium text-white">Email Visibility</p>
                  <p className="text-sm text-gray-400">Who can see your email address</p>
                </div>
                <select
                  value={settings.emailVisibility}
                  onChange={(e) => setSettings({...settings, emailVisibility: e.target.value})}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                >
                  <option value="private">Private</option>
                  <option value="contacts">Contacts Only</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-400" />
              Activity & Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div>
                  <p className="font-medium text-white">Show Online Status</p>
                  <p className="text-sm text-gray-400">Let others see when you're online</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showOnlineStatus}
                    onChange={(e) => setSettings({...settings, showOnlineStatus: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div>
                  <p className="font-medium text-white">Allow Tagging</p>
                  <p className="text-sm text-gray-400">Allow others to tag you in posts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowTagging}
                    onChange={(e) => setSettings({...settings, allowTagging: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data & Security */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PrivacyShield className="h-5 w-5 text-green-400" />
              Data & Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div>
                  <p className="font-medium text-white">Data Sharing</p>
                  <p className="text-sm text-gray-400">Control how your data is shared</p>
                </div>
                <select
                  value={settings.dataSharing}
                  onChange={(e) => setSettings({...settings, dataSharing: e.target.value})}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="none">No Sharing</option>
                  <option value="limited">Limited</option>
                  <option value="full">Full</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-yellow-400" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings({
                      ...settings, 
                      notifications: {...settings.notifications, email: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div>
                  <p className="font-medium text-white">Push Notifications</p>
                  <p className="text-sm text-gray-400">Receive browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings({
                      ...settings, 
                      notifications: {...settings.notifications, push: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div>
                  <p className="font-medium text-white">Security Alerts</p>
                  <p className="text-sm text-gray-400">Important security updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.security}
                    onChange={(e) => setSettings({
                      ...settings, 
                      notifications: {...settings.notifications, security: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
            >
              Save Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Profile Component
export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setUser(data.user || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to update profile');
      
      const updatedData = await res.json();
      setUser(updatedData.user || updatedData);
      setIsEditModalOpen(false);
      
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to change password');
      }
      
      alert('Password changed successfully!');
      setIsPasswordModalOpen(false);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(user, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'profile-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Profile data exported successfully!');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@example.com?subject=Profile Support Request';
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-transparent border-t-cyan-400 border-r-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-xl font-light text-gray-300 tracking-wider">
          LOADING <span className="text-cyan-400">PROFILE</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">Fetching your data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-md text-center shadow-2xl shadow-red-500/10">
        <div className="text-red-400 mb-4">
          <Zap className="w-16 h-16 mx-auto animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-gray-300 mb-6">{error}</p>
        <button 
          onClick={fetchProfile}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        {/* Futuristic Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    PROFILE DASHBOARD
                  </h1>
                </div>
                <p className="text-gray-400 font-light tracking-wide">MANAGE YOUR ACCOUNT & SETTINGS</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-2">
                  <div className="text-sm text-gray-400">User ID</div>
                  <div className="font-medium text-cyan-400">#{user.id || user._id || '0001'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden group">
                {/* Profile Header with Gradient */}
                <div className="bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Avatar with Animation */}
                    <div className="relative">
                      <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 backdrop-blur-sm border-4 border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-500 transition-all duration-500">
                        <span className="text-4xl md:text-5xl font-bold text-white">
                          {user.fullName?.charAt(0).toUpperCase() || 'U'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <div className="relative">
                          <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-ping absolute"></div>
                          <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white relative"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Name and Role */}
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold text-white">{user.fullName}</h2>
                          <div className="flex items-center gap-3 mt-3">
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                              user.role === 'admin' 
                                ? 'bg-gradient-to-r from-red-500/20 to-pink-600/20 text-red-400 border border-red-500/30' 
                                : user.role === 'faculty'
                                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-600/20 text-purple-400 border border-purple-500/30'
                                : 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                            }`}>
                              {user.role?.toUpperCase()}
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                              user.status === 'active' 
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-400 border border-green-500/30' 
                                : 'bg-gradient-to-r from-yellow-500/20 to-orange-600/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              {user.status?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsEditModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 rounded-lg hover:from-cyan-500/30 hover:to-blue-600/30 transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </button>
                      </div>
                      <p className="text-gray-300 mt-4 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-700/50 flex items-center gap-3">
                    <Database className="h-5 w-5 text-cyan-400" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg">
                          <Mail className="h-5 w-5 text-cyan-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Email Address</span>
                      </div>
                      <p className="text-white font-medium pl-11">{user.email}</p>
                      {user.emailVerified && (
                        <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                          <Verified className="h-4 w-4" />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Department */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 rounded-lg">
                          <Building className="h-5 w-5 text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Department</span>
                      </div>
                      <p className="text-white font-medium pl-11">{user.department || 'Not specified'}</p>
                    </div>

                    {/* Student ID */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/30 hover:border-green-500/30 transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-lg">
                          <IdCard className="h-5 w-5 text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Student ID</span>
                      </div>
                      <p className="text-white font-medium pl-11">{user.studentId || 'Not assigned'}</p>
                    </div>

                    {/* Role */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/30 hover:border-yellow-500/30 transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-lg">
                          <Shield className="h-5 w-5 text-yellow-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Role</span>
                      </div>
                      <p className="text-white font-medium pl-11">{user.role}</p>
                    </div>

                    {/* Phone */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/30 hover:border-red-500/30 transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 rounded-lg">
                          <Phone className="h-5 w-5 text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Phone Number</span>
                      </div>
                      <p className="text-white font-medium pl-11">{user.phone || 'Not provided'}</p>
                    </div>

                    {/* Address */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/30 hover:border-indigo-500/30 transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500/20 to-blue-600/20 rounded-lg">
                          <MapPin className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Address</span>
                      </div>
                      <p className="text-white font-medium pl-11">{user.address || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4" />
                          <span>Last login: Today</span>
                        </div>
                      </div>
                      <div className="text-cyan-400 font-medium flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        User ID: #{user.id || user._id || '0001'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Account Management */}
            <div className="space-y-6">
              {/* Account Security */}
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-cyan-400" />
                  Account Security
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-lg">
                        <Verified className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <div className="text-gray-300">Account Status</div>
                        <div className={`font-medium ${user.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {user.status?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg">
                        <Fingerprint className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-gray-300">2FA Enabled</div>
                        <div className="font-medium text-gray-400">
                          {user.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {user.twoFactorEnabled ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <ShieldCheck className="h-4 w-4" />
                          Active
                        </div>
                      ) : (
                        <button className="text-cyan-400 hover:text-cyan-300 text-sm">Enable</button>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-700/50">
                    <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Account ID
                    </div>
                    <div className="text-gray-300 font-mono text-sm bg-gray-900/50 p-2 rounded border border-gray-700/50">
                      {user.id || user._id || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-600/5 border border-cyan-500/20 hover:border-cyan-500/40 text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-600/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <Edit className="h-5 w-5 text-cyan-400" />
                      Edit Profile
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </button>
                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-600/5 border border-purple-500/20 hover:border-purple-500/40 text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-600/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-purple-400" />
                      Change Password
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </button>
                  <button 
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-indigo-600/5 border border-blue-500/20 hover:border-blue-500/40 text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-600/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-blue-400" />
                      Privacy Settings
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </button>
                  <button 
                    onClick={handleExportData}
                    className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-gradient-to-r from-green-500/5 to-emerald-600/5 border border-green-500/20 hover:border-green-500/40 text-white hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-600/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-green-400" />
                      Export Data
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-gradient-to-r from-red-500/5 to-pink-600/5 border border-red-500/20 hover:border-red-500/40 text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-600/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="h-5 w-5 text-red-400" />
                      Sign Out
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg">
                    <Server className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">System Status</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-gray-300">All systems operational</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Wifi className="h-4 w-4 text-green-400" />
                      <p className="text-xs text-gray-400">Connected to secure server</p>
                    </div>
                    <button 
                      onClick={handleContactSupport}
                      className="mt-3 flex items-center gap-1 text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors"
                    >
                      Need Help? Contact Support →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">Account Year</div>
                </div>
                <Calendar className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-400">
                    {user.role === 'admin' ? 'ADMIN' : 'USER'}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">Access Level</div>
                </div>
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-400">
                    {user.status === 'active' ? '100%' : '50%'}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">Account Health</div>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-400">
                    {user.emailVerified ? 'YES' : 'NO'}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">Verified</div>
                </div>
                <Verified className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Connected to Secure Database
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Last Updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditProfile}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onChangePassword={handleChangePassword}
      />

      <PrivacySettingsModal
        user={user}
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
}