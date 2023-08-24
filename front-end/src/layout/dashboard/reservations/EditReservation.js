import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { formatAsDate, formatAsTime } from "../../../utils/date-time";
import { getReservationById } from "../../../utils/api";

import EditReservationForm from "./EditReservationForm";
import ErrorAlert from "../../../utils/ErrorAlert";

export default function EditReservation({ lastPath, setReservationsChange }) {
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState();

  useEffect(() => {
    async function loadReservation() {
      try {
        const response = await getReservationById(reservation_id);
        response.reservation_date = formatAsDate(response.reservation_date);
        response.reservation_time = formatAsTime(response.reservation_time);
        setReservation(response);
        return response;
      } catch (error) {
        throw error;
      }
    }

    loadReservation();
  }, []);

  // Hooks
  const [submissionError, setSubmissionError] = useState(null);

  // JSX
  if (reservation) {
    return (
      <div>
        {submissionError ? (
          <ErrorAlert error={submissionError} />
        ) : (
          <EditReservationForm
            lastPath={lastPath}
            reservation={reservation}
            setReservationsChange={setReservationsChange}
            setSubmissionError={setSubmissionError}
          />
        )}
      </div>
    );
  } else {
    return <p>loading...</p>;
  }
}
