export default function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const setToken = async () => {
  const isDevelopment = import.meta.env.DEV;
  const BASE_URL = isDevelopment ? "http://localhost:8000" : "";

  try {
    const res = await fetch(`${BASE_URL}/api/login`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Could not fetch token");
    const data = await res.json();
    const message = data.message;

    return message;
  } catch (error) {
    console.error(error);
  }
};

export const getTokentValue = async () => {
  // Initial fetch call to ensure django sets the cookies
  await setToken();
  const token = getCookie("csrftoken");

  return token ? token : null;
};
