// src/pages/admin/CreateUser.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { API_BASE_URL } from '../../config/api';

export default function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    department: "",
    studentId: "",
    batch: "",
    role: "PLAYER",
  });

  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "front") setIdFront(file);
      else setIdBack(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Basic validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.fullName ||
      !formData.department ||
      !formData.studentId
    ) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (!idFront || !idBack) {
      setError("Both ID front and back photos are required");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone || "");
    data.append("department", formData.department);
    data.append("studentId", formData.studentId);
    data.append("batch", formData.batch || "");
    data.append("role", formData.role);

    data.append("idFront", idFront);
    data.append("idBack", idBack);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create user");
      }

      setSuccess(
        "User created successfully! They will appear in pending list after approval.",
      );
      setTimeout(() => {
        navigate("/admin/users");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Create New User
          </h1>
          <p className="text-indigo-100">
            Register a new player, coach or admin — they will start in PENDING
            status
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <CheckCircle size={20} />
              {success}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="user@astu.edu.et"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone (optional)
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="0911223344"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Software Engineering"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID *
              </label>
              <input
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="001/2020/15"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch/Year (optional)
              </label>
              <input
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="2023"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="PLAYER">Player</option>
                <option value="COACH">Coach</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {/* ID Uploads */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ID Card Front *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleFileChange(e, "front")}
                  className="hidden"
                  id="idFront"
                />
                <label htmlFor="idFront" className="cursor-pointer">
                  {idFront ? (
                    <div className="space-y-3">
                      <img
                        src={URL.createObjectURL(idFront)}
                        alt="ID Front"
                        className="max-h-48 mx-auto rounded-lg shadow"
                      />
                      <p className="text-sm text-gray-600">{idFront.name}</p>
                    </div>
                  ) : (
                    <>
                      <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-700">
                        Click to upload front side
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG • max 5MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ID Card Back *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleFileChange(e, "back")}
                  className="hidden"
                  id="idBack"
                />
                <label htmlFor="idBack" className="cursor-pointer">
                  {idBack ? (
                    <div className="space-y-3">
                      <img
                        src={URL.createObjectURL(idBack)}
                        alt="ID Back"
                        className="max-h-48 mx-auto rounded-lg shadow"
                      />
                      <p className="text-sm text-gray-600">{idBack.name}</p>
                    </div>
                  ) : (
                    <>
                      <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-700">
                        Click to upload back side
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG • max 5MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-10 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-60 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Creating user...
              </>
            ) : (
              <>
                <UserPlus size={22} />
                Create User
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
