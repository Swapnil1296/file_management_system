import React, { useEffect, useState } from "react";
import ProgressBar from "../utils/ProgressBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UploadFiles = () => {
  const [value, setValue] = useState(0);
  const [success, setSuccess] = useState(false);
  const [updloadFile, setUploadFile] = useState();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    setDisabled(false);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setUploadFile(selectedFile);
    }
  };
  const token = localStorage.getItem("file_token");
  const handleUploadFile = async () => {
    try {
      setLoading(true);
      setShowProgress(true);

      setDisabled(true);
      const formData = new FormData();
      formData.append("file", updloadFile);

      const upload = await axios.post(
        "http://localhost:8080/file/upload-files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total) {
              const percentCompleted = Math.round((loaded * 100) / total);
              setValue(percentCompleted / 100); // Update the progress bar
            }
          },
        }
      );
      console.log(upload);
      if (upload.status === 401) {
        localStorage.removeItem("file_token");
        navigate("/sign-in");
      }

      if (upload.status === 200) {
        setUploadFile("");
        setShowProgress(false);
        setLoading(false);
        // Reset file input field value ***  setUploadFile(""); this was not working properly
        document.getElementById("fileInput").value = null;
        setDisabled(true);
        Swal.fire({
          title: "Are you sure?",
          text: "You will not be able to open your account!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, Redirect to all files page!",
          cancelButtonText: "No, I want to upload more files !",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/all-files");
          }
        });
      }
    } catch (error) {
      setShowProgress(false);
      setLoading(false);
      setUploadFile("");
      setDisabled(true);
      setLoading(false);
      console.log(
        "error while uploading file ;===>",
        error
      );
    }
  };

  useEffect(() => {
    setInterval(() => {
      setValue((val) => val + 0.1);
    }, 20);
  }, []);
  return (
    <div className="flex justify-center items-center ">
      <div className=" w-1/2 h-[600px] flex flex-col justify-center items-center mt-5 bg-slate-400 space-y-8">
        <div className="">
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="text-blue-950 font-semibold
            file:mr-5 file:py-3 file:px-10
            file:rounded-full file:border-0
            file:text-md file:font-semibold  file:text-teal-950
            file:bg-gradient-to-r file:from-blue-600 file:to-amber-600
            hover:file:cursor-pointer hover:file:opacity-80"
          />
        </div>
        <button
          onClick={handleUploadFile}
          disabled={disabled}
          type="button"
          class="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#333] hover:bg-[#222] active:bg-[#333]"
        >
          Upload File
        </button>

        {showProgress ? (
          <>
            <ProgressBar value={value} onComplete={() => setSuccess(true)} />
            <span>{success ? "Complete!" : "Loading..."}</span>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default UploadFiles;
