import { useState } from "react";
// Material UI components
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
// Components
import Login from "../Components/Login";
import Register from "../Components/Register";

const Authentication = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <div className="login_container bg-slate-800 font-overpass flex flex-col pt-28 items-center w-full m-auto h-screen">
        <div className="login_contenet bg-slate-100 shadow-sm shadow-blue-400 border-[1px] rounded-md border-gray-300 xl:w-[30rem] pt-5 py-3 flex justify-center items-center flex-col">
          
          {/* Tabs for Login and Register */}
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            className="w-full"
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: currentTab === 0 ? '#15803d' : '#1d4ed8',
              },
              '& .MuiTab-root': {
                minWidth: 'auto',
                flex: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
              },
              '& .MuiTab-root.Mui-selected': {
                color: currentTab === 0 ? '#15803d' : '#1d4ed8',
              }
            }}
          >
            <Tab
              icon={<LockOpenIcon />}
              label="LOGIN"
              sx={{
                '&.Mui-selected': {
                  color: '#15803d',
                }
              }}
            />
            <Tab
              icon={<PersonAddIcon />}
              label="REGISTER"
              sx={{
                '&.Mui-selected': {
                  color: '#1d4ed8',
                }
              }}
            />
          </Tabs>

          {/* Tab Content */}
          {currentTab === 0 ? <Login /> : <Register />}
          
          {/* Switch between forms */}
          <div className="switch_form_text text-center text-sm text-gray-600 mt-4 mb-2">
            {currentTab === 0 ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setCurrentTab(1)}
                  className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setCurrentTab(0)}
                  className="text-green-600 hover:text-green-800 font-semibold cursor-pointer underline"
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;

// Sample data for testing:
// HOD: { "name":"John Doe", "email":"hod@gmail.com", "branch":"CSE", "password":"12345" }
// Teacher: { "name":"Jane Smith", "email":"teacher@gmail.com", "specilization":"Computer Science", "password":"12345" }
// Student: { "name":"Bob Johnson", "email":"student@gmail.com", "course":"B.Tech", "sem":3, "branch":"CSE", "password":"12345" }
