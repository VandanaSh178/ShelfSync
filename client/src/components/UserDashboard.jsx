import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

import logo from "../assets/black-logo.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyBorrows,fetchBorrowHistory } from "../store/slices/borrowSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { myBorrows,borrowHistory } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    dispatch(fetchMyBorrows());
    dispatch(fetchBorrowHistory());
  }, [dispatch]);

  // Add this temporarily:
useEffect(() => {
  console.log("myBorrows:", myBorrows);
  console.log("borrowHistory:", borrowHistory);
}, [myBorrows, borrowHistory]);

  useEffect(() => {
  setTotalBorrowedBooks(myBorrows.filter((b) => b.returned === false).length);
  setTotalReturnedBooks(borrowHistory.filter((b) => b.returned === true).length);
}, [myBorrows, borrowHistory]);

  const data = {
    labels: ["Currently Borrowed", "Returned"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3E", "#f97316"],  // second color changed to orange for contrast
        hoverOffset: 4,
      },
    ],
  };

  return (
    <main className="relative flex-1 p-6 pt-28">
      <div className="flex flex-col-reverse xl:flex-row gap-7">

        {/* LEFT SIDE */}
        <div className="flex flex-[4] flex-col gap-7 lg:py-5 justify-between xl:min-h-[85.5vh]">
          <div className="flex flex-col gap-7 flex-[4]">
            <div className="flex flex-col lg:flex-row gap-7">

              {/* Borrowed Books Card */}
              <div className="flex items-center gap-4 bg-white p-5 min-h-[120px] rounded-lg transition hover:shadow-inner duration-300 flex-1">
                <span className="w-[5px] bg-black self-stretch rounded-full"></span>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <img src={bookIcon} alt="book-icon" className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Currently Borrowed</p>
                  <p className="text-3xl font-bold text-gray-900">{totalBorrowedBooks}</p> {/* ✅ dynamic count */}
                </div>
              </div>

              {/* Returned Books Card */}
              <div className="flex items-center gap-4 bg-white p-5 min-h-[120px] rounded-lg transition hover:shadow-inner duration-300 flex-1">
                <span className="w-[5px] bg-orange-500 self-stretch rounded-full"></span>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <img src={returnIcon} alt="return-icon" className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Returned</p>
                  <p className="text-3xl font-bold text-gray-900">{totalReturnedBooks}</p> {/* ✅ dynamic count */}
                </div>
              </div>

            </div>

            {/* Browse + Logo Row */}
            <div className="flex flex-col lg:flex-row gap-7">
              <div className="flex items-center gap-4 bg-white p-5 min-h-[120px] rounded-lg transition hover:shadow-inner duration-300 flex-1 cursor-pointer">
                <span className="w-[5px] bg-black self-stretch rounded-full"></span>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <img src={browseIcon} alt="browse-icon" className="w-8 h-8" />
                </div>
                <p className="text-lg xl:text-xl font-semibold">Browse Books Inventory</p>
              </div>
              <img src={logo_with_title} alt="logo" className="hidden lg:block w-auto object-contain" />
            </div>
          </div>

          {/* Quote Card */}
          <div className="bg-white p-7 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-52 font-semibold relative flex flex-[3] justify-center items-center rounded-2xl">
            <h4>"A reader lives a thousand lives before he dies."</h4>
            <p className="text-gray-700 text-sm sm:text-lg absolute right-[35px] sm:right-[78px] bottom-[10px]">
              ~ShelfSync Team
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — Pie chart */}  {/* ✅ was empty before */}
        <div className="flex-[2] flex flex-col gap-7 lg:flex-row xl:flex-col items-center justify-between xl:gap-10 py-5">
          <div className="bg-white rounded-2xl p-6 w-full flex flex-col items-center gap-4 shadow-sm">
            <h3 className="text-base font-bold text-gray-700 uppercase tracking-widest">Borrow Overview</h3>
            <div className="w-full max-w-[260px]">
              {totalBorrowedBooks + totalReturnedBooks > 0 ? (
                <Pie data={data} className="mx-auto lg:mx-0 w-full h-auto" />
              ) : (
                <p className="text-center text-gray-400 text-sm py-10">No borrow data yet.</p>
              )}
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#3D3E3E] inline-block"></span>
                Borrowed: <strong>{totalBorrowedBooks}</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
                Returned: <strong>{totalReturnedBooks}</strong>
              </span>
            </div>
          </div>

          {/* Logo for xl screens */}
          <div className="hidden xl:flex bg-white rounded-2xl p-6 w-full justify-center items-center shadow-sm">
            <img src={logo} alt="logo" className="w-24 h-24 object-contain opacity-80" />
          </div>
        </div>

      </div>
    </main>
  );
};

export default UserDashboard;