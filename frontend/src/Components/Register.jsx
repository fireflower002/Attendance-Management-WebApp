import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { host } from "../API/API";
import Cookie from "js-cookie";

const Register = () => {
  const navigate = useNavigate();

  // Registration form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentRegisterUser, setCurrentRegisterUser] = useState("");
  
  // User type specific fields
  const [branch, setBranch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [course, setCourse] = useState("");
  const [sem, setSem] = useState("");
  
  // Loading and UI states
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const toggleShowPass = (event) => {
    event.preventDefault();
    setShowPass(!showPass);
  };

  const toggleShowConfirmPass = (event) => {
    event.preventDefault();
    setShowConfirmPass(!showConfirmPass);
  };

  useEffect(() => {
    const token = Cookie.get("_secure_user_");
    const _id = Cookie.get("unique_key");
    const type = Cookie.get("user_type");

    if (token && _id && type) {
      const getLoggedUserData = async (token, _id, type) => {
        try {
          const config = {
            headers: {
              authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.get(`${host}/${type}`, config);
          const { type: currentUserType } = data;
          navigate(`/${currentUserType}`);
        } catch (error) {
          console.log(`Error getting context API data: ${error}`);
          navigate("/");
        }
      };

      getLoggedUserData(token, _id, type);
    }
  }, [navigate]);

  // Handle registration
  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Basic validation
    if (!name || !email || !password || !confirmPassword || !currentRegisterUser) {
      toast.warn("Please fill all required fields", { autoClose: 1000 });
      setLoading(false);
      return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { autoClose: 1000 });
      setLoading(false);
      return;
    }

    // User type specific validation
    if (currentRegisterUser === "hod" && !branch) {
      toast.warn("Please enter branch for HOD", { autoClose: 1000 });
      setLoading(false);
      return;
    }

    if (currentRegisterUser === "teacher" && !specialization) {
      toast.warn("Please enter specialization for Teacher", { autoClose: 1000 });
      setLoading(false);
      return;
    }

    if (currentRegisterUser === "student" && (!course || !sem || !branch)) {
      toast.warn("Please fill Course, Semester and Branch for Student", { autoClose: 1000 });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let response;
      let registrationData = {
        name,
        email,
        password,
      };

      // Handle registration based on user type
      if (currentRegisterUser === "hod") {
        registrationData.branch = branch;
        response = await axios.post(
          `${host}/hod/register`,
          registrationData,
          config
        );
      } else if (currentRegisterUser === "teacher") {
        registrationData.specilization = specialization;
        response = await axios.post(
          `${host}/teacher/register`,
          registrationData,
          config
        );
      } else if (currentRegisterUser === "student") {
        registrationData.course = course;
        registrationData.sem = parseInt(sem);
        registrationData.branch = branch;
        response = await axios.post(
          `${host}/student/register`,
          registrationData,
          config
        );
      }

      if (response && response.data) {
        toast.success(`${currentRegisterUser} Account Created Successfully!`, {
          autoClose: 2000,
        });
        
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setBranch("");
        setSpecialization("");
        setCourse("");
        setSem("");
        setCurrentRegisterUser("");
        
        // Redirect to login after successful registration
        setTimeout(() => {
          window.location.reload(); // This will show login form
        }, 2000);
      }

      setLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage, { autoClose: 2000 });
      setLoading(false);
    }
  };

  // Render user-specific fields based on selected user type
  const renderUserSpecificFields = () => {
    if (currentRegisterUser === "hod") {
      return (
        <div className="branch_box flex flex-col gap-2">
          <label htmlFor="register_branch" className="text-xl font-[600] opacity-70">
            Branch *
          </label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            id="register_branch"
            className="py-1 px-3 w-full bg-gray-200"
            required
          >
            <option value="">Select Branch</option>
            <option value="CSE">Computer Science & Engineering</option>
            <option value="ECE">Electronics & Communication</option>
            <option value="EEE">Electrical & Electronics</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
          </select>
        </div>
      );
    }

    if (currentRegisterUser === "teacher") {
      return (
        <div className="specialization_box flex flex-col gap-2">
          <label htmlFor="register_specialization" className="text-xl font-[600] opacity-70">
            Specialization *
          </label>
          <input
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            type="text"
            id="register_specialization"
            className="py-1 px-3 w-full bg-gray-200"
            placeholder="Enter Your Specialization"
            required
          />
        </div>
      );
    }

    if (currentRegisterUser === "student") {
      return (
        <>
          <div className="course_box flex flex-col gap-2">
            <label htmlFor="register_course" className="text-xl font-[600] opacity-70">
              Course *
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              id="register_course"
              className="py-1 px-3 w-full bg-gray-200"
              required
            >
              <option value="">Select Course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
            </select>
          </div>

          <div className="sem_branch_box flex gap-4">
            <div className="sem_box flex flex-col gap-2 flex-1">
              <label htmlFor="register_sem" className="text-xl font-[600] opacity-70">
                Semester *
              </label>
              <select
                value={sem}
                onChange={(e) => setSem(e.target.value)}
                id="register_sem"
                className="py-1 px-3 w-full bg-gray-200"
                required
              >
                <option value="">Sem</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

            <div className="branch_box flex flex-col gap-2 flex-1">
              <label htmlFor="register_student_branch" className="text-xl font-[600] opacity-70">
                Branch *
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                id="register_student_branch"
                className="py-1 px-3 w-full bg-gray-200"
                required
              >
                <option value="">Branch</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
              </select>
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <form className="register_form xl:w-[30rem] w-[24rem] sm:px-16 px-10 flex flex-col gap-5 py-9 mt-[-2rem]">
        {/* Name field */}
        <div className="name_box flex flex-col gap-2">
          <label htmlFor="register_name" className="text-xl font-[600] opacity-70">
            Full Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="register_name"
            className="py-1 px-3 w-full bg-gray-200"
            placeholder="Enter Your Full Name"
            required
          />
        </div>

        {/* Email field */}
        <div className="email_box flex flex-col gap-2">
          <label htmlFor="register_email" className="text-xl font-[600] opacity-70">
            Email Address *
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="register_email"
            className="py-1 px-3 w-full bg-gray-200"
            placeholder="Enter Your Email Address"
            required
          />
        </div>

        {/* User type selection */}
        <div className="who_is flex items-center justify-start gap-6 pl-1 my-2">
          <div className="is_student flex justify-center items-center gap-1">
            <input
              type="radio"
              className="relative top-[-2px]"
              id="register_student_checkbox"
              name="register_who_is"
              checked={currentRegisterUser === "student"}
              onChange={() => setCurrentRegisterUser("student")}
            />
            <label
              htmlFor="register_student_checkbox"
              className="text-[1rem] selection:bg-white font-[600] opacity-70 cursor-pointer"
            >
              Student
            </label>
          </div>

          <div className="is_teacher flex justify-center items-center gap-1">
            <input
              type="radio"
              className="relative top-[-2px]"
              id="register_teacher_checkbox"
              name="register_who_is"
              checked={currentRegisterUser === "teacher"}
              onChange={() => setCurrentRegisterUser("teacher")}
            />
            <label
              htmlFor="register_teacher_checkbox"
              className="text-[1rem] selection:bg-white font-[600] opacity-70 cursor-pointer"
            >
              Teacher
            </label>
          </div>

          <div className="is_hod flex justify-center items-center gap-1">
            <input
              type="radio"
              className="relative top-[-2px]"
              id="register_hod_checkbox"
              name="register_who_is"
              checked={currentRegisterUser === "hod"}
              onChange={() => setCurrentRegisterUser("hod")}
            />
            <label
              htmlFor="register_hod_checkbox"
              className="text-[1rem] selection:bg-white font-[600] opacity-70 cursor-pointer"
            >
              HOD
            </label>
          </div>
        </div>

        {/* User-specific fields */}
        {renderUserSpecificFields()}

        {/* Password field */}
        <div className="password_box flex flex-col gap-2">
          <label htmlFor="register_password" className="text-xl font-[600] opacity-70">
            Password *
          </label>
          <div className="password flex items-center">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              id="register_password"
              className="py-1 px-3 w-full bg-gray-200"
              placeholder="Enter Password"
              required
            />
            <button
              type="button"
              tabIndex="-1"
              onClick={toggleShowPass}
              className="show_button bg-gray-200 py-1 px-2 rounded-br-md rounded-tr-md"
            >
              {!showPass ? (
                <VisibilityOffIcon className="text-gray-700" />
              ) : (
                <VisibilityIcon className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password field */}
        <div className="confirm_password_box flex flex-col gap-2">
          <label htmlFor="register_confirm_password" className="text-xl font-[600] opacity-70">
            Confirm Password *
          </label>
          <div className="password flex items-center">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPass ? "text" : "password"}
              id="register_confirm_password"
              className="py-1 px-3 w-full bg-gray-200"
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              tabIndex="-1"
              onClick={toggleShowConfirmPass}
              className="show_button bg-gray-200 py-1 px-2 rounded-br-md rounded-tr-md"
            >
              {!showConfirmPass ? (
                <VisibilityOffIcon className="text-gray-700" />
              ) : (
                <VisibilityIcon className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Register button */}
        <div className="button_box flex flex-col justify-center items-center gap-4">
          <button
            onClick={handleRegister}
            className="bg-blue-700 w-full py-[5px] rounded opacity-90 text-white text-xl hover:bg-blue-600 hover:text-slate-100 custom-transition text-opacity-90"
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress color="inherit" size={28} />
              </Box>
            ) : (
              "Register"
            )}
          </button>
        </div>
      </form>

      <ToastContainer />
    </>
  );
};

export default Register;
