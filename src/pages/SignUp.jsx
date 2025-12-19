import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets";
import InputForm from "../components/InputForm";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { validateEmail } from "../util/validate";
import axiosConfig from "../util/axiosConfig";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uploadProfileImage from "../util/uploadProfilePageUrl";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
    setIsLoading(true);

    if (!fullName.trim()) {
      setError("Please enter a valid full name.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    setError("");
    //sign up call

    try {
      if (profilePhoto) {
        const imageUrl = await uploadProfileImage(profilePhoto);
        profileImageUrl = imageUrl || "";
      }
      const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      if (response.status === 201) {
        toast.success("Profile created successfully");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      console.error("Something went wrong. Please try again.", err);
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* background */}
      <img
        src={assets.login_bg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-black text-center mb-2">
            Create An Account
          </h3>
          <p className="text-sm text-slate-700 text-center mb-8">
            Start tracking your spending by joining us.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <ProfilePhotoSelector
                image={profilePhoto}
                setImage={setProfilePhoto}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <InputForm
                value={fullName}
                onChange={setFullName}
                label="Full Name"
                placeholder="Enter full name"
                type="text"
              />
              <InputForm
                value={email}
                onChange={setEmail}
                label="Email"
                placeholder="Enter email"
                type="email"
              />
            </div>

            {/* Password with eye icon */}
            <div className="relative">
              <InputForm
                value={password}
                onChange={setPassword}
                label="Password"
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {error && (
              <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className={`w-full bg-[#77868d] text-white py-2 rounded-lg hover:bg-[#5f6b71] transition flex items-center justify-center gap-2 ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  <span>Signing Up...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="text-sm text-slate-800 text-center mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#77868d] underline hover:text-[#5f6b71] transition-colors"
              >
                Login
              </Link>
            </p>

            {/* Toast container
            <ToastContainer position="top-right" autoClose={3000} /> */}
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SignUp;
