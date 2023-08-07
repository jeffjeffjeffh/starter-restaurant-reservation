import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { updateReservation } from "../../utils/api";
import validateNewReservation from "../../utils/validateNewReservation";
import { formatAsDate } from "../../utils/date-time";

export default function ReservationForm({
  lastPath,
  reservation,
  reservationsChange,
  setReservationsChange,
  setSubmissionError,
}) {
  // State
  const [formData, setFormData] = useState(reservation);

  // Handlers
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.id]: target.value });
  };

  const date = formatAsDate(formData.reservation_date);
  console.log(date);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);
    try {
      let isNew = false;
      validateNewReservation(formData, isNew);
      console.log(formData);
      await updateReservation(formData);
      setReservationsChange(!reservationsChange);
      history.push(`/dashboard/?date=${date}`);
    } catch (error) {
      setSubmissionError(error);
    }
  };

  const history = useHistory();

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  // JSX
  return (
    <div className="reservationFormContainer">
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First name:</label>
        <input
          type="text"
          name="first_name"
          id="first_name"
          required
          placeholder="First name"
          value={formData.first_name}
          onChange={handleChange}
        ></input>

        <label htmlFor="last_name">Last name:</label>
        <input
          type="text"
          name="last_name"
          id="last_name"
          required
          placeholder="Last name"
          value={formData.last_name}
          onChange={handleChange}
        ></input>

        <label htmlFor="mobile_number">Mobile phone number:</label>
        <input
          type="text"
          name="mobile_number"
          id="mobile_number"
          required
          placeholder="(xxx) xxx-xxxx"
          value={formData.mobile_number}
          onChange={handleChange}
        ></input>

        <label htmlFor="reservation_date">Date of reservation:</label>
        <input
          type="date"
          name="reservation_date"
          id="reservation_date"
          required
          value={formData.reservation_date}
          onChange={handleChange}
        ></input>

        <label htmlFor="reservation_time">Time of reservation:</label>
        <input
          type="time"
          name="reservation_time"
          id="reservation_time"
          required
          value={formData.reservation_time}
          onChange={handleChange}
        ></input>

        <label htmlFor="people">Number of guests:</label>
        <input
          type="number"
          name="people"
          id="people"
          placeholder="Number of guests"
          required
          min="1"
          value={formData.people}
          onChange={handleChange}
        ></input>

        <button type="submit">Submit</button>

        <button onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}
