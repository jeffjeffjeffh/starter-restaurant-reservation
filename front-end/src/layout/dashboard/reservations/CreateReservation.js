import React, { useState } from "react";

import ReservationForm from "./ReservationForm";
import ErrorAlert from "../../../utils/ErrorAlert";

export default function CreateReservation({ setReservationsChange }) {
  // Hooks
  const [submissionError, setSubmissionError] = useState(null);

  // JSX
  return (
    <div>
      {
        <ReservationForm
          isNew={true}
          setReservationsChange={setReservationsChange}
          setSubmissionError={setSubmissionError}
        />
      }
      {submissionError && <ErrorAlert error={submissionError} />}
    </div>
  );
}
