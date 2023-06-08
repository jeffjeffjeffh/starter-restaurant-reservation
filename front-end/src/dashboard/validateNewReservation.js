import { today } from "../utils/date-time";

function validatePeople(people) {
  if (people < 1) {
    throw new Error("Reservation must be created with at least one guest");
  }
}

function validateTime(time) {
  // The reservation time should be at least an hour
  // before the restaurant's closing time,
  // or at / after opening time.
  const error = new Error(
    "Reservation cannot be created outside of business hours or within an hour of closing time."
  );

  const latestHour = 21;
  const latestMinutes = 30;
  const earliestHour = 10;
  const earliestMinutes = 30;

  const resHour = parseInt(time.slice(0, 2));
  const resMinutes = parseInt(time.slice(3));

  // First taking care of invalid hours,
  // then the two invalid half-hour cases
  if (resHour < earliestHour || resHour > latestHour) {
    throw error;
  }

  if (resHour === earliestHour && resMinutes < earliestMinutes) {
    throw error;
  }

  if (resHour === latestHour && resMinutes > latestMinutes) {
    throw error;
  }
}

function validateDate(date) {
  // A reservation should not be able to be created on a past date.
  const error = new Error("Reservation cannot be created on a past date.");

  const resYear = parseInt(date.slice(0, 4));
  const resMonth = parseInt(date.slice(5, 7));
  const resDay = parseInt(date.slice(8));

  const curDate = today();
  const curYear = parseInt(curDate.slice(0, 4));
  const curMonth = parseInt(curDate.slice(5, 7));
  const curDay = parseInt(curDate.slice(8));

  if (resYear < curYear) {
    throw error;
  }

  if (resYear === curYear) {
    if (resMonth < curMonth) {
      throw error;
    } else if (resMonth === curMonth && resDay < curDay) {
      throw error;
    }
  }
}

function dayIsNotTuesday(date) {
  // If a reservation is on a Tuesday, it's invalid.
  const resDay = new Date(date).getDay();

  if (resDay === 1) {
    throw new Error(
      "Reservations cannot be created for Tuesday - We're closed!"
    );
  }
}

export default function validateNewReservation(reservation) {
  validatePeople(reservation.people);
  validateTime(reservation.reservation_time);
  validateDate(reservation.reservation_date);
  dayIsNotTuesday(reservation.reservation_date);
}
