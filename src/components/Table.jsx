import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import API from "../Instance/Axios";
import checkTokenAndNavigate from "../utils/JwtDecode";
const Table = () => {
  const token = localStorage.getItem("file_token");
  const [getfiles, setGetFiles] = useState("");
  const [getuserId, setUserId] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  //  const decodedToken = jwtDecode(token);
  //  console.log("decodedToken:", decodedToken);
  useEffect(() => {
    if (token) {
      checkTokenAndNavigate(token);
      const decodedToken = jwtDecode(token);

      const { userId } = decodedToken;

      if (userId && userId !== null) {
        setUserId(userId);
        getData(userId);
      }
    }
  }, [token, page]);
  const getData = (userId) => {
    API({
      method: "GET",
      url: `/file/user-uploaded-files/${userId}/${page}`,
    })
      .then((response) => {
        setGetFiles(response.data.files);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.log("error==>", error.data?.errorMessage));
  };
  const handleFileDelete = async (fileId) => {
    API({
      method: "DELETE",
      url: `/file/delete-files/${fileId}`,
    })
      .then(() => {
        getData(getuserId);
      })
      .catch((error) => console.log("error==>", error.data.errorMessage));
  };
  const handleDownloadfiles = async (fileId) => {
    API({
      method: "GET",
      url: `/file/download-files/${fileId}`,
    })
      .then((response) => {
        console.log("response==>", response);
      })
      .catch((error) => console.log("error==>", error.data.errorMessage));
  };

  return (
    <>
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
          {getfiles.length > 0 && getfiles ? (
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
                    <button
                      className="mr-4"
                      title="Delete"
                      onClick={() => handleFileDelete(item.id)}
                    >
                      <RiDeleteBin6Line />
                    </button>
                    <button className="mr-4" title="View">
                      <FaEye />
                    </button>
                    <button
                      className="mr-4"
                      title="download"
                      onClick={() => handleDownloadfiles(item.id)}
                    >
                      <MdFileDownload />
                    </button>
                  </td>
                </tr>
              </tbody>
            ))
          ) : (
            <div>No data to Show</div>
          )}
        </table>
      </div>
      <div>
        {totalPages > 1 &&
          Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className="px-4 py-2 mt-4 mx-2 font-bold text-white bg-teal-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
            >
              {index + 1}
            </button>
          ))}
      </div>
    </>
  );
};

export default Table;
