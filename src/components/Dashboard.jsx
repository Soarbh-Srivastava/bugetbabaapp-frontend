import MenuBar from "./MenuBar";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import Sidebar from "./Sidebar";

const Dashboard = ({ children, activeMenu }) => {
  const { user } = useContext(AppContext);
  return (
    <div>
      <MenuBar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden container w-60 border-r border-gray-200/50 min-h-[calc(100vh-64px)] pt-6">
            <Sidebar activeMenu={activeMenu} />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
