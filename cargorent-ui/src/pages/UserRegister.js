import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import { Car, User, Building2 } from "lucide-react";

function UserRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = queryParams.get("role");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (roleFromUrl) {
      setRole(roleFromUrl.toUpperCase());
    } else {
      setRole("CUSTOMER");
    }
  }, [roleFromUrl]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register({ name, email, password, role });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isCompany = role === "COMPANY";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-xl border-slate-100">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 rounded-full">
              {isCompany ? <Building2 className="h-8 w-8 text-primary" /> : <User className="h-8 w-8 text-primary" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create {isCompany ? "Company" : "User"} Account</CardTitle>
          <p className="text-sm text-slate-500">Enter your details to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="text"
              label={isCompany ? "Company Name" : "Full Name"}
              placeholder={isCompany ? "Acme Car Rentals" : "John Doe"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Hidden Role Input Concept or just logic */}
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-sm text-slate-600">
              Registering as: <span className="font-semibold text-slate-900">{role}</span>
              {!roleFromUrl && (
                <div className="mt-2 text-xs">
                  <button type="button" onClick={() => setRole("CUSTOMER")} className={`mr-2 ${role === 'CUSTOMER' ? 'font-bold text-primary' : 'underline'}`}>Customer</button>
                  <button type="button" onClick={() => setRole("COMPANY")} className={`mr-2 ${role === 'COMPANY' ? 'font-bold text-primary' : 'underline'}`}>Company</button>
                  <button type="button" onClick={() => setRole("MEMBER")} className={`mr-2 ${role === 'MEMBER' ? 'font-bold text-primary' : 'underline'}`}>Member</button>
                  <button type="button" onClick={() => setRole("ADMIN")} className={`${role === 'ADMIN' ? 'font-bold text-primary' : 'underline'}`}>Admin</button>
                </div>
              )}
            </div>

            {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

            <Button type="submit" className="w-full" isLoading={loading}>
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="ml-1 font-medium text-primary hover:underline">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default UserRegister;