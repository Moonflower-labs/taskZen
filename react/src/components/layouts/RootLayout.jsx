import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../Navbar";
import Header from "../Header";
import Footer from "../Footer";

const Root = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <div id="liveAlertPlaceholder"></div>
      <div className="main-container container-fluid">
        <Outlet />
      </div>
      <Footer />
      <ScrollRestoration />
    </div>
  );
};

export default Root;
