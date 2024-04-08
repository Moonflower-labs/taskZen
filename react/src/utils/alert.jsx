import { Alert } from "bootstrap";
import { renderToString } from "react-dom/server";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
const successIcon = renderToString(<FaCheckCircle />);
const failIcon = renderToString(<FaTimesCircle />);
const appendAlert = (() => {
  let lastId = 0;
  return (message, type) => {
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    const alertId = `alert-${lastId++}`; // Generate unique alert ID
    const wrapper = document.createElement("div");
    wrapper.className = `alert alert-${type} fade show d-flex text-center justify-content-center align-items-center position-fixed top-50 start-50 translate-middle z-9 w-75`;
    wrapper.id = alertId;
    wrapper.setAttribute("role", "alert");
    wrapper.innerHTML = `
      <span class="me-2">${type === "success" ? successIcon : failIcon}</span>
      <div>${message}</div> `;

    alertPlaceholder.append(wrapper);

    const alertElement = document.getElementById(alertId);
    const alert = Alert.getOrCreateInstance(alertElement);
    setTimeout(() => {
      alert.close();
    }, 3000);
  };
})();

export default appendAlert;
