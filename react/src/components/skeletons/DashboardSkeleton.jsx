import Navbar from "..//Navbar";
import Header from "../Header";
import Footer from "../Footer";

const DashboardSkeleton = () => {
  const staticPrefix = import.meta.env.PROD ? "/static" : "";

  const yingYangImgUrl = `${staticPrefix}/ying-yang.png`;
  return (
    <div className="container-fluid text-center px-0">
      <Header />
      <Navbar />
      <img
        src={yingYangImgUrl}
        width={200}
        alt="task image"
        className="img-fluid mx-auto mb-3"
      />
      <div className="row">
        <div className="col-md-5 mb-3">
          <div className="card" aria-hidden="true">
            <div className="card-body">
              <h5 className="card-title placeholder-glow">
                <span className="placeholder col-6"></span>
              </h5>
              <p className="card-text placeholder-glow">
                <span className="placeholder col-7"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-6"></span>
                <span className="placeholder col-8"></span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card" aria-hidden="true">
            <div className="card-body">
              <h5 className="card-title placeholder-glow">
                <span className="placeholder col-6"></span>
              </h5>
              <p className="card-text placeholder-glow">
                <span className="placeholder col-7"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-6"></span>
                <span className="placeholder col-8"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardSkeleton;
