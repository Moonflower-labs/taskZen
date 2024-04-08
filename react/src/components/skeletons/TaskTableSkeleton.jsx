function TaskTableSkeleton() {
  return (
    <table className="table text-center align-middle">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="placeholder-glow">
            <div className="placeholder col-2"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-6"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-4"></div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <div className="placeholder col-1"></div>
              <a className="btn btn-outline-secondary disabled placeholder col-6"></a>
            </div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <a className="btn btn-success disabled placeholder col-2"></a>
              <a className="btn btn-outline-danger disabled placeholder col-2"></a>
            </div>
          </td>
        </tr>
        <tr>
          <td className="placeholder-glow">
            <div className="placeholder col-2"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-6"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-4"></div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <div className="placeholder col-1"></div>
              <a className="btn btn-outline-secondary disabled placeholder col-6"></a>
            </div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <a className="btn btn-success disabled placeholder col-2"></a>
              <a className="btn btn-outline-danger disabled placeholder col-2"></a>
            </div>
          </td>
        </tr>
        <tr>
          <td className="placeholder-glow">
            <div className="placeholder col-2"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-6"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-4"></div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <div className="placeholder col-1"></div>
              <a className="btn btn-outline-secondary disabled placeholder col-6"></a>
            </div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <a className="btn btn-success disabled placeholder col-2"></a>
              <a className="btn btn-outline-danger disabled placeholder col-2"></a>
            </div>
          </td>
        </tr>
        <tr>
          <td className="placeholder-glow">
            <div className="placeholder col-2"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-6"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-4"></div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <div className="placeholder col-1"></div>
              <a className="btn btn-outline-secondary disabled placeholder col-6"></a>
            </div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <a className="btn btn-success disabled placeholder col-2"></a>
              <a className="btn btn-outline-danger disabled placeholder col-2"></a>
            </div>
          </td>
        </tr>
        <tr>
          <td className="placeholder-glow">
            <div className="placeholder col-2"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-6"></div>
          </td>
          <td className="placeholder-glow">
            <div className="placeholder col-4"></div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <div className="placeholder col-1"></div>
              <a className="btn btn-outline-secondary disabled placeholder col-6"></a>
            </div>
          </td>
          <td className="placeholder-glow">
            <div className="d-flex justify-content-around">
              <a className="btn btn-success disabled placeholder col-2"></a>
              <a className="btn btn-outline-danger disabled placeholder col-2"></a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default TaskTableSkeleton;
