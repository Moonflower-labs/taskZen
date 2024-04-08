import getCookie from "../utils/cookie";

// Reusable fetch
export default async function fetchAPI(url, options = {}) {
  const isDevelopment = import.meta.env.DEV;
  const BASE_URL = isDevelopment ? "http://localhost:8000" : "";

  const _csrfToken = getCookie("csrftoken");
  if (!_csrfToken) return;
  //   Set the token in the headers
  options.headers = { ...options.headers, "X-CSRFToken": _csrfToken };
  //  Include credentials
  options.credentials = "include";
  try {
    const response = await fetch(`${BASE_URL}/${url}`, options);
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function fetchTasks(page = 1, queryParams = {}, options = {}) {
  const isDevelopment = import.meta.env.DEV;
  const BASE_URL = isDevelopment ? "http://localhost:8000" : "";
  const _csrfToken = getCookie("csrftoken");
  if (!_csrfToken) return;

  queryParams["page"] = page; // Add the page parameter to queryParams object
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${BASE_URL}/api/task/list?${queryString}`;

  options.headers = { ...options.headers, "X-CSRFToken": _csrfToken };
  // Include credentials
  options.credentials = "include";

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
