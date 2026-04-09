import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, LineElement, PointElement, ArcElement,
} from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBorrows } from "../store/slices/borrowSlice";
import { getUsers } from "../store/slices/userSlice";
import { Users, BookOpen, ShieldCheck, BookMarked, RotateCcw, TrendingUp, Quote } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

const StatCard = ({ icon: Icon, label, value, accent, bg }) => (
  <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon className={`w-4 h-4 ${accent}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className="text-2xl font-black text-gray-900 tabular-nums leading-none">{value}</p>
    </div>
    <div className={`w-1 h-8 rounded-full flex-shrink-0 ${accent.replace("text-", "bg-")}`} />
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { allUsers = [] } = useSelector((state) => state.users);
  const { books = [] } = useSelector((state) => state.books);
  const { allBorrows = [] } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(fetchAllBorrows());
    dispatch(getUsers());
  }, [dispatch]);

  const totalUsers = allUsers.filter((u) => u.role === "user").length;
  const totalAdmin = allUsers.filter((u) => u.role === "admin").length;
  const totalBooks = books.length;
  const totalBorrowed = allBorrows.filter((b) => !b.returned).length;
  const totalReturned = allBorrows.filter((b) => b.returned).length;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  const pieData = {
    labels: ["Regular Users", "Admins"],
    datasets: [{
      data: [totalUsers, totalAdmin],
      backgroundColor: ["#111827", "#f97316"],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const pieOptions = {
    cutout: 0,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#111827", padding: 10, cornerRadius: 8 },
    },
  };

  return (
    <main className="flex-1 px-6 pb-6 pt-4 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="mb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500 mb-0.5">Admin Panel</p>
        <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* LEFT — Stats */}
        <div className="xl:col-span-2 flex flex-col gap-3">

          <StatCard icon={Users} label="Total Users" value={totalUsers} accent="text-indigo-500" bg="bg-indigo-50" />
          <StatCard icon={ShieldCheck} label="Total Admins" value={totalAdmin} accent="text-orange-500" bg="bg-orange-50" />
          <StatCard icon={BookMarked} label="Total Books" value={totalBooks} accent="text-gray-700" bg="bg-gray-100" />

          {/* Borrow Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Borrowed</p>
              </div>
              <p className="text-3xl font-black tabular-nums">{totalBorrowed}</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-orange-400">Returned</p>
              </div>
              <p className="text-3xl font-black tabular-nums text-orange-500">{totalReturned}</p>
            </div>
          </div>

        </div>

        {/* RIGHT — Profile + Chart + Quote */}
        <div className="xl:col-span-3 flex flex-col gap-3">

          {/* Admin Profile Card */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white text-base font-black">{initials}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-0.5">Signed in as Admin</p>
                <h2 className="text-lg font-black text-gray-900 truncate">{user?.name || "Administrator"}</h2>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Online</span>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Breakdown</p>
                <h3 className="text-base font-black text-gray-900">User Distribution</h3>
              </div>
              <div className="p-2 bg-gray-50 rounded-xl">
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="w-36 h-36 flex-shrink-0">
                {totalUsers + totalAdmin > 0 ? (
                  <Pie data={pieData} options={pieOptions} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No data</div>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {[
                  { label: "Regular Users", value: totalUsers, color: "bg-gray-900" },
                  { label: "Admins", value: totalAdmin, color: "bg-orange-500" },
                  { label: "Books in Circulation", value: totalBorrowed, color: "bg-indigo-500" },
                  { label: "Books Returned", value: totalReturned, color: "bg-emerald-500" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
                    <span className="text-xs text-gray-500 flex-1">{label}</span>
                    <span className="text-xs font-black text-gray-900 tabular-nums">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quote Card */}
          <div className="bg-gray-900 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <Quote className="w-5 h-5 text-orange-500 mb-2" />

            <p className="text-white text-sm font-medium leading-relaxed relative z-10">
              "Embarking on the journey of reading fosters personal growth, nurturing a path towards excellence and the refinement of character."
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="w-6 h-0.5 bg-orange-500 rounded-full" />
              <p className="text-gray-400 text-xs font-semibold">ShelfSync Team</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;