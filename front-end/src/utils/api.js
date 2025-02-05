/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const axios = require("axios");

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.log("Fetch JSON error: ", error.message);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function createReservation(reservation) {
  // First coerce "people" to a number for backend validation to pass
  reservation.people = Number(reservation.people);
  const controller = new AbortController();
  try {
    const response = await axios.post(`${API_BASE_URL}/reservations/`, {
      signal: controller.signal,
      data: reservation,
    });
    return response;
  } catch (error) {
    console.log("Create reservation error: ", error);
    throw error;
  }
}

export async function createTable(table) {
  // First coerce "capacity" to a number for backend validation to pass
  table.capacity = Number(table.capacity);
  const controller = new AbortController();

  try {
    const response = axios.post(`${API_BASE_URL}/tables/`, {
      signal: controller.signal,
      data: table,
    });
    return response;
  } catch (error) {
    console.log("Create table error:", error);
    throw error;
  }
}

export async function updateReservation(reservation) {
  // Coerce "people" to a number for backend validation to pass
  reservation.people = Number(reservation.people);
  const controller = new AbortController();

  try {
    const response = await axios.put(
      `${API_BASE_URL}/reservations/${reservation.reservation_id}`,
      {
        signal: controller.signal,
        data: reservation,
      }
    );
    return response;
  } catch (error) {
    console.log("Create reservation error: ", error);
    throw error;
  }
}

export async function listTables() {
  const controller = new AbortController();

  try {
    const response = await axios.get(`${API_BASE_URL}/tables`, {
      signal: controller.signal,
    });
    return response.data.data;
  } catch (error) {
    console.log("List tables error:", error);
    throw error;
  }
}

export async function seatReservation(form) {
  const { table_id, reservation_id } = form;
  const path = `${API_BASE_URL}/tables/${table_id}/seat`;
  const controller = new AbortController();

  try {
    await axios.put(path, {
      data: { reservation_id },
      signal: controller.signal,
    });
  } catch (error) {
    console.log("Seat reservation error: ", error);
    throw error;
  }
}

export async function clearTable(table_id) {
  const path = `${API_BASE_URL}/tables/${table_id}/seat`;
  const controller = new AbortController();

  try {
    await axios.delete(path, { signal: controller.signal });
  } catch (error) {
    console.log("Error clearing table: ", error);
    throw error;
  }
}

export async function searchReservationsByMobileNumber(mobile_number) {
  const path = `${API_BASE_URL}/reservations?mobile_number=${mobile_number}`;
  const controller = new AbortController();

  try {
    const response = await axios.get(path, { signal: controller.signal });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getReservationById(reservation_id) {
  const path = `${API_BASE_URL}/reservations/${reservation_id}`;
  const controller = new AbortController();

  try {
    const response = await axios.get(path, { signal: controller.signal });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function cancelReservation(reservation_id) {
  const path = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const controller = new AbortController();

  try {
    await axios.put(path, {
      data: { status: "cancelled" },
      signal: controller.signal,
    });
  } catch (error) {
    throw error;
  }
}
