import { BsYinYang } from "react-icons/bs";
import { GiMeditation } from "react-icons/gi";
import { useRouteLoaderData } from "react-router-dom";

const Header = () => {
  const { user } = useRouteLoaderData("root") || {};
  return (
    <header className="p-3 text-white">
      <div className="d-flex justify-content-between align-items-center gap-4">
        <p className="company-badge my-auto h4 text-primary rounded-2 px-2">
          {user?.company}
        </p>

        <div className="d-flex gap-3 align-items-start">
          <GiMeditation size={40} />
          <h1>Task Zen</h1>
          <BsYinYang size={40} className="logo" />
        </div>
      </div>
    </header>
  );
};

export default Header;
