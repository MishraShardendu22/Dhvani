import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Droplets, ArrowRight, LockKeyhole, Mail, Heart } from "lucide-react";
import axiosInstance from "../../../util/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../_Layout";
import axios from "axios";

const ForgotPasswordModal = ({ isOpen, onClose, setError }: { isOpen: boolean; onClose: () => void; setError: (error: string) => void }) => {
  const [resetStep, setResetStep] = useState(1);
  const [emailReset, setEmailReset] = useState("");
  const [otpReset, setOtpReset] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [info, setInfo] = useState("");

  const sendOtpPassReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post("/admin/sendOtpAdmin", { email: emailReset });
      if (res.status === 200) {
        setInfo("OTP sent to your email.");
        setResetStep(2);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Failed to send OTP");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const otpVerifyPassReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post("/admin/verifyOtpAdmin", {
        email: emailReset,
        otp: otpReset
      });
      if (res.status === 200) {
        setInfo("OTP verified.");
        setResetStep(3);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "OTP verification failed");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const resetPass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post("/admin/resetPassAdmin", {
        email: emailReset,
        password: newPassword,
        otp: otpReset
      });
      if (res.status === 200) {
        setInfo("Password reset successfully.");
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Reset Password failed");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h2 className="mb-4 text-xl font-bold">Forgot Password</h2>
            {info && <p className="mb-4 text-green-600">{info}</p>}
            {resetStep === 1 && (
              <form onSubmit={sendOtpPassReset} className="space-y-4">
                <div>
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={emailReset}
                    onChange={(e) => setEmailReset(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onClose} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Send OTP</Button>
                </div>
              </form>
            )}

            {resetStep === 2 && (
              <form onSubmit={otpVerifyPassReset} className="space-y-4">
                <div>
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otpReset}
                    onChange={(e) => setOtpReset(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onClose} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Verify OTP</Button>
                </div>
              </form>
            )}

            {resetStep === 3 && (
              <form onSubmit={resetPass} className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onClose} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Reset Password</Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminPassword: "",
  });
  const [error, setError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/admin/login", formData);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.data);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Login failed");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-100">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex items-end h-32 bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt="Blood Donation"
              src="/admin-login-health.webp"
              className="absolute inset-0 object-cover w-full h-full opacity-80"
            />

            <div className="hidden lg:relative lg:block lg:p-12">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Droplets className="h-8 text-white sm:h-10" />
                <Badge variant="secondary" className="text-sm">
                  Admin Portal
                </Badge>
              </motion.div>

              <motion.h2
                className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome Back, Sir!
              </motion.h2>

              <motion.p
                className="mt-4 leading-relaxed text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Thank you for being an Admin.
              </motion.p>
            </div>
          </section>

          <main className="flex items-center justify-center px-8 py-8 text-slate-600 bg-slate-100 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <Card className="w-full max-w-xl">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-6 h-6 text-primary" />
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <Badge variant="outline" className="mb-2">
                      Admin Access
                    </Badge>
                    <CardTitle className="text-2xl">Sign in to Admin Portal</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Access your Admin dashboard to manage appointments and track donations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin Password</Label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="adminPassword"
                        type="password"
                        name="adminPassword"
                        placeholder="Enter your admin password"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-500 rounded-md bg-red-50">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Button type="submit" className="w-full text-slate-200" size="lg">
                      Sign in as Admin
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Not registered?{" "}
                        <Link to="/admin/register" className="font-medium text-primary hover:underline">
                          Register here
                        </Link>
                      </p>
                      <Button variant="link" onClick={() => setShowResetModal(true)} className="text-sm">
                        Forgot Password?
                      </Button>
                    </div>
                  </div>
                </motion.form>
              </CardContent>
            </Card>
          </main>
        </div>
        <ForgotPasswordModal
          isOpen={showResetModal}
          onClose={() => {
            setShowResetModal(false);
            setError("");
          }}
          setError={setError}
        />
      </div>
    </Layout>
  );
};

export default LoginAdmin;