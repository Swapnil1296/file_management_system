// Import necessary libraries
const express = require("express");
const axios = require("axios");
const app = express();

// Define a route to fetch file content from Firebase Storage
app.get("/api/fetch-file-content", async (req, res) => {
  try {
    // Replace 'FIREBASE_STORAGE_URL' with your actual Firebase Storage URL
    const firebaseStorageUrl =
      "https://firebasestorage.googleapis.com/v0/b/file-management-5a68f.appspot.com/o/files%2FALKEM_ETH_08-May-2024%20(11).csvswapnil%40gmail.com?alt=media&token=171250cb-0544-4fba-9d3d-db6eb871c085";

    // Fetch file content from Firebase Storage
    const response = await axios.get(firebaseStorageUrl, {
      responseType: "blob", // Set responseType to 'blob' to receive binary data
    });

    // Send file content back to the client
    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
