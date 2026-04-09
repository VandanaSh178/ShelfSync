import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../store/slices/userSlice";
import { Users as UsersIcon, Shield, User } from "lucide-react";

const Users = () => {
  const dispatch = useDispatch();
  const { allUsers = [], loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    return new Date(timeStamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Base</h2>
          <p className="text-gray-500 text-sm">All registered members and administrators.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 font-semibold shadow-sm">
            Total: <span className="text-gray-900">{allUsers.length}</span>
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">#</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">User</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Email</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Role</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Joined</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Books</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allUsers.length > 0 ? (
                allUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">

                    {/* # */}
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                      {index + 1}
                    </td>

                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                          {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                              <span className="text-white text-[10px] font-black">{getInitials(user.name)}</span>
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-500 text-xs">{user.email}</td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-bold uppercase">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-bold uppercase">
                          <User className="w-3 h-3" /> Member
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>

                    {/* Books */}
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-semibold">{user.borrowedBooks?.length || 0}</span>
                      <span className="text-gray-400 text-xs ml-1">borrowed</span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {user.accountVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Pending
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <UsersIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No users found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
};

export default Users;