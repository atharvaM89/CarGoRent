import { useEffect, useState } from "react";
import api from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Check, X, Shield } from "lucide-react";

function AdminDashboard() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/companies");
            console.log("Admin Companies:", response.data);
            setCompanies(response.data);
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.post(`/admin/companies/${id}/approve`);
            fetchCompanies();
        } catch (error) {
            console.error("Failed to approve", error);
            alert("Failed to approve company");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject/deactivate this company?")) return;
        try {
            await api.post(`/admin/companies/${id}/reject`);
            fetchCompanies();
        } catch (error) {
            console.error("Failed to reject", error);
            alert("Failed to reject company");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" /> Company Approvals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-3 font-medium">Company Name</th>
                                            <th className="pb-3 font-medium">Email</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {companies.map((company) => (
                                            <tr key={company.id} className="group">
                                                <td className="py-3 font-medium">{company.companyName}</td>
                                                <td className="py-3 text-slate-500">{company.address || "N/A"}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${company.active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {company.active ? 'Active' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-3 flex gap-2">
                                                    {!company.active && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 h-8 px-2"
                                                            onClick={() => handleApprove(company.id)}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" /> Approve
                                                        </Button>
                                                    )}
                                                    {company.active && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-2"
                                                            onClick={() => handleReject(company.id)}
                                                        >
                                                            <X className="h-4 w-4 mr-1" /> Deactivate
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {companies.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="py-4 text-center text-slate-500">No companies found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminDashboard;
