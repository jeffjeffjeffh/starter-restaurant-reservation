import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import ErrorAlert from "../../../utils/ErrorAlert";

import "./TableForm.css";

const { createTable } = require("../../../utils/api");

export default function TableForm({ setTablesChange }) {
  const emptyForm = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [submissionError, setSubmissionError] = useState(null);

  const history = useHistory();

  // Handlers
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.id]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);
    try {
      await createTable(formData);
      setTablesChange(Date.now());
      history.push("/");
    } catch (error) {
      setSubmissionError(error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  // JSX
  return (
    <div className="tableFormContainer">
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">Table name</label>
        <input
          type="text"
          name="table_name"
          id="table_name"
          placeholder="Table name"
          value={formData.table_name}
          onChange={handleChange}
        ></input>
        <label htmlFor="capacity">Table capacity</label>

        <input
          type="number"
          name="capacity"
          id="capacity"
          placeholder="Capacity"
          min="1"
          value={formData.capacity}
          onChange={handleChange}
        ></input>

        <button type="submit">Submit</button>

        <button onClick={handleCancel}>Cancel</button>
      </form>
      {submissionError ? <ErrorAlert error={submissionError} /> : null}
    </div>
  );
}
