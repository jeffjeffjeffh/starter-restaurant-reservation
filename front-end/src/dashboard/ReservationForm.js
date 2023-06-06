import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../utils/ErrorAlert";

import "./ReservationForm.css";

export default function ReservationForm() {
  // Form stuff
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submissionError, setSubmissionError] = useState(null);

  // Handlers
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.id]: target.value });
  };

  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);
    try {
      await createReservation(formData);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      console.log(error);
      setSubmissionError(error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.push("/");
  };

  // JSX
  return (
    <div className="reservationFormContainer">
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">
          First name:
          <input
            type="text"
            name="first_name"
            id="first_name"
            placeholder="First name"
            value={formData.first_name}
            onChange={handleChange}
          ></input>
        </label>
        <label htmlFor="last_name">
          Last name:
          <input
            type="text"
            name="last_name"
            id="last_name"
            placeholder="Last name"
            value={formData.last_name}
            onChange={handleChange}
          ></input>
        </label>
        <label htmlFor="mobile_number">
          Mobile phone number:
          <input
            type="text"
            name="mobile_number"
            id="mobile_number"
            placeholder="(xxx) xxx-xxxx"
            value={formData.mobile_number}
            onChange={handleChange}
          ></input>
        </label>
        <label htmlFor="reservation_date">
          Date of reservation:
          <input
            type="date"
            name="reservation_date"
            id="reservation_date"
            value={formData.reservation_date}
            onChange={handleChange}
          ></input>
        </label>
        <label htmlFor="reservation_time">
          Time of reservation:
          <input
            type="time"
            name="reservation_time"
            id="reservation_time"
            value={formData.reservation_time}
            onChange={handleChange}
          ></input>
        </label>
        <label htmlFor="people">
          Number of guests:
          <input
            type="text"
            name="people"
            id="people"
            placeholder="Number of guests"
            value={formData.people}
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
