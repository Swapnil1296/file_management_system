import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const RecordMedia = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const token = localStorage.getItem("file_token");

  useEffect(() => {
    let timer;
    if (isRecording && !isPaused) {
      timer = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const pauseRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0); // Reset the recording time
    }
  };

  const uploadAudio = async () => {
    try {
      if (audioBlob) {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recorded_audio.webm");
        const res = await axios.post(
          "http://localhost:8080/file/upload-audio",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAudioBlob(null);
        console.log("Audio uploaded successfully==>", res);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <div className="flex  space-y-3 justify-center items-center mt-2">
      <div className="flex flex-wrap space-x-3  justify-center mt-8 w-1/2">
        <button
          className={`px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 ${
            isRecording ? "bg-green-500" : ""
          }`}
          onClick={startRecording}
          disabled={isRecording}
        >
          Start Recording Audio
        </button>
        <button
          className={`px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 ${
            !isRecording || isPaused ? "bg-gray-500 cursor-not-allowed" : ""
          }`}
          onClick={pauseRecording}
          disabled={!isRecording || isPaused}
        >
          Pause Recording
        </button>
        <button
          className={`px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 ${
            !isRecording || !isPaused ? "bg-red-800 cursor-not-allowed" : ""
          }`}
          onClick={resumeRecording}
          disabled={!isRecording || !isPaused}
        >
          Resume Recording
        </button>
        <button
          className={`px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 ${
            !isRecording ? "bg-yellow-500 cursor-not-allowed" : ""
          }`}
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop Recording
        </button>
        {isRecording && (
          <div className="text-white mt-5 bg-blue-500 px-4 py-2 rounded-full relative flex justify-center items-center space-x-2 ">
            <div className="">Recording: {recordingTime} sec</div>
            <div>
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-950 rounded-full animate-ping " />
            </div>
          </div>
        )}
        {audioBlob && (
          <div className="flex justify-center space-x-3 items-center mt-6">
            <audio
              className="h-10"
              controls
              src={URL.createObjectURL(audioBlob)}
            />
            <button
              className="px-4 py-2 h-10 rounded-full text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={uploadAudio}
              disabled={!audioBlob}
            >
              Upload Audio
            </button>
            <button
              className="px-4 py-2 h-10 rounded-full text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => setAudioBlob(null)}
              disabled={!audioBlob}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordMedia;
