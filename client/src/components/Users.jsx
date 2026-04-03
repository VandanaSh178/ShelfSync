import React, { useEffect } from "react";
import { useSelector,useDispatch} from "react-redux";
import Header from "../layout/Header";
import { getUsers } from "../store/slices/userSlice";

const Users = () => {
  
  const dispatch = useDispatch();
  const {allUsers,loading}= useSelector((state) => state.users);

  useEffect(() => {
    // Fetch users when component mounts
    dispatch(getUsers());
  }, [dispatch]);

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter the list to match your logic
  const filteredUsers = allUsers || [];

  return (
    <div className="flex-1 bg-white min-h-screen">
      <Header />
      
      <main className="p-8 mt-4">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Registered Users
          </h2>
        </header>

        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-widest text-gray-400">ID</th>
                  <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Name</th>
                  <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Email</th>
                  <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Role</th>
                  <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Join Date</th>
                  <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Books</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                    {/* ID Placeholder */}
                    <td className="py-4 px-6 text-sm text-gray-400 font-mono">#{index + 1}</td>
                    
                    <td className="py-4 px-6 text-sm font-semibold text-gray-800">{user.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-orange-50 text-orange-600 border border-orange-100">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {user.borrowedBooks?.length || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
             <p className="text-gray-400 font-medium">No administrative users found.</p>
          </div>
        )
        }
      </main>
    </div>
  );
};

export default Users;