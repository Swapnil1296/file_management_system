import React from "react";
import Table from "../components/Table";
import PrivateRoute from "../components/PrivateRoute";

const AllFiles = () => {
  return (
    <div className="m-8  flex justify-center items-center flex-col">
      <Table />
    </div>
  );
};

export default AllFiles;
