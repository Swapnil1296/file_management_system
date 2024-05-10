import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Table = () => {
  const token = localStorage.getItem("file_token");
  const [getfiles, setGetFiles] = useState();

  const getData = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/file/user-uploaded-files/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setGetFiles(res.data.files);
      }
    } catch (error) {
      console.log("error===>", error);
    }
  };
  useEffect(() => {
    // Decode the token to get the user id
    if (token) {
      const decodedToken = jwtDecode(token);
      const { userId } = decodedToken;
      getData(userId);
    }
  }, [token]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white font-[sans-serif]">
        <thead className="bg-gray-800 whitespace-nowrap">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              User Id
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              File Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Delete
            </th>
          </tr>
        </thead>
        {getfiles &&
          getfiles.map((item, index) => (
            <tbody
              key={item.id}
              className={index % 2 === 0 ? "bg-blue-50" : "bg-blue-100"}
            >
              <tr className="border border-gray-200">
                <td className="px-6 py-4 text-sm border border-gray-200">
                  {item.user_id}
                </td>

                <td className="px-6 py-4 text-sm border border-gray-200">
                  {item.filename}
                </td>

                <td className="px-6 py-4 border border-gray-200">
                  <button className="mr-4" title="Delete">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 fill-red-500 hover:fill-red-700"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                        data-original="#000000"
                      />
                      <path
                        d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                        data-original="#000000"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default Table;
