import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../utils/ErrorAlert";
import "./TableForm.css";

const { createTable } = require("../utils/api");

export default function TableForm(props) {
  const emptyForm = {
    table_id: "",
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
    console.log("submitted table form: ", formData);

    setSubmissionError(null);
    try {
      // client-side validation
      await createTable(formData);
      // redirect
    } catch (error) {
      setSubmissionError(error);
    }

    history.push("/");
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  // JSX
  return (
    <div className="tableFormContainer">
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">
          Table name
          <input
            type="text"
            name="table_name"
            id="table_id"
            placeholder="Table name"
            value={FormData.table_name}
            onChange={handleChange}
          ></input>
        </label>
        <label htmlFor="capacity">
          Table capacity
          <input
            type="text"
            name="capacity"
            id="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
          ></input>
        </label>
        <button type="submit">Submit</button>
        <button onClick={handleCancel}>Cancel</button>
      </form>
      {submissionError ? <ErrorAlert error={submissionError} /> : null}
    </div>
  );
}
