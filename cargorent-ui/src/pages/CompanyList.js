import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Building2, MapPin, Search } from "lucide-react";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    setFilteredCompanies(companies.filter(c =>
      c.companyName?.toLowerCase().includes(lower) ||
      c.address?.toLowerCase().includes(lower)
    ));
  }, [searchTerm, companies]);

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/companies");
      setCompanies(response.data);
      setFilteredCompanies(response.data);
    } catch (error) {
      console.error(error);
      // alert("Failed to load companies"); // Replace alert with inline error or toast later
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rental Companies</h1>
          <p className="text-slate-500 mt-1">Choose a trusted partner for your journey</p>
        </div>
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search companies..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate(`/cars/${company.id}`)}>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{company.companyName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-slate-500 text-sm mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {company.address || "Location not specified"}
                </div>
                <p className="text-sm text-slate-600 mt-4 line-clamp-2">
                  Premium fleet available for rent. Book your dream car today.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                  View Fleet
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredCompanies.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">No companies found matching your search.</p>
        </div>
      )}
    </div>
  );
}

export default CompanyList;