import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowRight, Shield, Clock, MapPin } from 'lucide-react';
import api from '../services/api';

function LandingPage() {
  const { t } = useTranslation();
  const [allCars, setAllCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);

  useEffect(() => {
    api.get('/cars/public')
      .then(res => setAllCars(res.data || []))
      .catch(() => setAllCars([]))
      .finally(() => setCarsLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl">
              {t('landing.heroTitle')} <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">{t('landing.heroBrand')}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
              {t('landing.heroSubtitle')}
            </p>

            <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('landing.pickupDate')}</label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full p-3 border rounded-md"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('landing.returnDate')}</label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full p-3 border rounded-md"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('landing.location')}</label>
                  <input
                    type="text"
                    id="location"
                    placeholder={t('landing.locationPlaceholder')}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('landing.carType')}</label>
                  <select id="carType" className="w-full p-3 border rounded-md">
                    <option value="">{t('landing.anyType')}</option>
                    <option value="SUV">SUV</option>
                    <option value="SEDAN">Sedan</option>
                    <option value="HATCHBACK">Hatchback</option>
                    <option value="LUXURY">Luxury</option>
                    <option value="EV">Electric Vehicle</option>
                  </select>
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('landing.minSeats')}</label>
                  <input
                    type="number"
                    id="seatingCapacity"
                    placeholder={t('landing.any')}
                    min="1"
                    className="w-full p-3 border rounded-md"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    size="lg"
                    className="w-full h-[50px] bg-black hover:bg-slate-800"
                    onClick={() => {
                      const start = document.getElementById('startDate').value;
                      const end = document.getElementById('endDate').value;
                      const loc = document.getElementById('location').value;
                      const type = document.getElementById('carType').value;
                      const seats = document.getElementById('seatingCapacity').value;

                      if (start && end) {
                        const params = new URLSearchParams({ startDate: start, endDate: end });
                        if (loc) params.append('location', loc);
                        if (type) params.append('carType', type);
                        if (seats) params.append('seatingCapacity', seats);

                        window.location.href = `/search?${params.toString()}`;
                      } else {
                        alert("Please select both dates");
                      }
                    }}
                  >
                    {t('landing.searchCars')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-slate-400 text-sm">
              {t('landing.or')} <Link to="/companies" className="text-white underline underline-offset-4 hover:text-blue-400">{t('landing.browseByCompany')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse All Cars - no login required */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-2">{t('landing.browseAllCars')}</h2>
          <p className="text-slate-600 text-center mb-10 max-w-xl mx-auto">
            {t('landing.browseAllSubtitle')}
          </p>
          {carsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto py-4">
              {allCars.map((car) => (
                <Link
                  key={car.id}
                  to={`/search?startDate=&endDate=`}
                  className="group bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-slate-100 overflow-hidden">
                    <img
                      src={car.url || car.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900">{car.brand} {car.model}</h3>
                    <p className="text-sm text-slate-500">₹{car.pricePerDay}{t('landing.perDay')}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <span>{car.carType}</span>
                      <span>•</span>
                      <span>{car.seatingCapacity} {t('landing.seats')}</span>
                      <span>•</span>
                      <span>{car.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!carsLoading && allCars.length === 0 && (
            <p className="text-center text-slate-500 py-8">{t('landing.noCarsYet')}</p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-3 bg-blue-50 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('landing.secureBooking')}</h3>
              <p className="text-slate-600">{t('landing.secureBookingDesc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-3 bg-blue-50 rounded-full mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('landing.support24')}</h3>
              <p className="text-slate-600">{t('landing.support24Desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-3 bg-blue-50 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('landing.wideCoverage')}</h3>
              <p className="text-slate-600">{t('landing.wideCoverageDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-100">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">{t('landing.readyToHit')}</h2>
              <p className="text-slate-600 max-w-md">{t('landing.readySubtitle')}</p>
            </div>
            <Link to="/companies">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">{t('landing.startJourney')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;