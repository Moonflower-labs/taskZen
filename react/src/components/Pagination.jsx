/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

const Pagination = ({ totalPages, linkTo }) => {
  let location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = Number(searchParams.get("page")) || 1;
  let searchWithoutPage = new URLSearchParams(location.search);
  searchWithoutPage.delete("page");
  const qParams = searchWithoutPage.toString();

  const pagesArray = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  return (
    <>
      {totalPages > 1 && (
        <nav
          aria-label="Page navigation"
          className="d-flex justify-content-center"
        >
          <ul className="pagination">
            <li className="page-item">
              <Link
                className={`page-link shadow-none ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                to={{
                  pathname: `/${linkTo}`,
                  search: `?page=${currentPage - 1}${
                    qParams ? `&${qParams}` : ""
                  }`,
                }}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </Link>
            </li>
            {pagesArray.map((page) => (
              <li className="page-item" key={page}>
                <Link
                  className={`page-link shadow-none ${
                    currentPage === page ? "active" : ""
                  }`}
                  to={{
                    pathname: `/${linkTo}`,
                    search: `?page=${page}${qParams ? `&${qParams}` : ""}`,
                  }}
                >
                  {page}
                </Link>
              </li>
            ))}
            <li className="page-item">
              <Link
                className={`page-link shadow-none ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
                to={{
                  pathname: `/${linkTo}`,
                  search: `?page=${currentPage + 1}${
                    qParams ? `&${qParams}` : ""
                  }`,
                }}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Pagination;
