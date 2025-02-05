import React, { useState } from "react";

import { searchReservationsByMobileNumber } from "../../../utils/api";

import "./SearchForm.css";

export default function SearchForm({ setFilteredReservations }) {
  const initialFormData = {
    mobile_number: "",
  };

  // Hooks
  const [formData, setFormData] = useState(initialFormData);

  // Handlers
  async function handleSubmit(event) {
    event.preventDefault();
    const response = await searchReservationsByMobileNumber(
      formData.mobile_number
    );
    setFilteredReservations(response);
  }

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  // JSX
  return (
    <form onSubmit={handleSubmit} className="searchForm">
      <label htmlFor="mobile_number">
        Enter a mobile number to search for:
      </label>
      <input
        name="mobile_number"
        id="mobile_number"
        value={FormData.mobile_number}
        onChange={handleChange}
        placeholder="Enter a customer's phone number"
        required
      ></input>
      <button type="submit">Find</button>
    </form>
  );
}
