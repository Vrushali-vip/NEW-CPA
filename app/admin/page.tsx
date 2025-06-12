"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { type InsuranceFormValues } from "@/lib/insuranceFormSchema"; // Adjust path if necessary
import { Button } from "@/components/ui/button";


interface DisplayQuoteResult {
    ok: boolean;
    message: string;
    data?: {
        totalAmount: number;
        medicalCoverAmount: number;
        paCoverAmount: number;
        travellersCount: number;
        totalDays: number;
    };
}

interface StoredSubmission {
    formData: InsuranceFormValues;
    quote: DisplayQuoteResult | null;
    submittedAt: string;
}

const formatEuroAdmin = (amount: number | undefined) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(amount);
}

// Helper for country code to name (add more as needed)
const COUNTRY_NAMES: Record<string, string> = {
    AL: 'Albania',
    DE: 'Germany',
    UA: 'Ukraine',
    // ... add more as needed
};

function formatDate(value: string | undefined): string {
    if (!value) return 'N/A';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatPhone(code: string | undefined, number: string | undefined): string {
    if (!code && !number) return 'N/A';
    return `${code || ''} ${number || ''}`.trim();
}

function getCountryName(code: string | undefined): string {
    if (!code) return 'N/A';
    return COUNTRY_NAMES[code] || code;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderOtherDetailValue(value: any, key?: string, parentObj?: any): React.ReactNode {
    if (key === 'c_birthdate' || key === 'c_passport_expiry_date') return formatDate(value);
    if (key === 'c_nationality') return getCountryName(value);
    if (key === 'c_phone') return formatPhone(parentObj?.c_phone_code, parentObj?.c_phone_number);
    if (key === 'c_whats_app') return formatPhone(parentObj?.c_whats_app_code, parentObj?.c_whats_app_number);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) {
        if (value.length === 0) return <span>-</span>;
        return (
            <ul className="list-disc list-inside pl-4">
                {value.map((item, idx) => (
                    <li key={idx}>{renderOtherDetailValue(item)}</li>
                ))}
            </ul>
        );
    }
    if (typeof value === 'object' && value !== null) {
        return (
            <table className="table-auto border rounded bg-gray-50 text-xs mb-2">
                <tbody>
                    {Object.entries(value).map(([k, v]) => (
                        <tr key={k}>
                            <td className="font-semibold pr-2 align-top">{k}:</td>
                            <td>{renderOtherDetailValue(v, k, value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
    if (value === '' || value === undefined || value === null) return 'N/A';
    return String(value);
}

export default function AdminPage() {
    const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [purchases, setPurchases] = useState<any[]>([]);
    const [purchaseFilter, setPurchaseFilter] = useState("");
    const [activeMenu, setActiveMenu] = useState<'insurance' | 'prices'>('insurance');

    // State for Manage Prices form
    const [zone, setZone] = useState('Green');
    const [price, setPrice] = useState('');
    const [level, setLevel] = useState('Base');
    const [statusMsg, setStatusMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add coverage amount selection
    const [coverage, setCoverage] = useState('25000');

    // Pricing matrix state for admin
    const defaultPricing = {
        matrix: {
            "25000": { "greenME": 19.00, "amberME": 23.75, "redME": 0.0, "blackME": 0.0, "greenPA": 12.38, "amberPA": 13.61, "redPA": 0.0, "blackPA": 0.0 },
            "50000": { "greenME": 22.00, "amberME": 27.50, "redME": 30.25, "blackME": 0.0, "greenPA": 24.75, "amberPA": 29.25, "redPA": 31.73, "blackPA": 0.0 },
            "100000": { "greenME": 26.00, "amberME": 32.50, "redME": 35.75, "blackME": 0.0, "greenPA": 49.50, "amberPA": 54.00, "redPA": 58.95, "blackPA": 0.0 },
            "150000": { "greenME": 30.00, "amberME": 37.50, "redME": 40.25, "blackME": 0.0, "greenPA": 74.25, "amberPA": 81.68, "redPA": 89.84, "blackPA": 0.0 },
            "250000": { "greenME": 36.00, "amberME": 45.00, "redME": 49.50, "blackME": 0.0, "greenPA": 123.75, "amberPA": 136.13, "redPA": 149.74, "blackPA": 0.0 }
        },
        transitCost: 25.00,
        germanyGreenMERates: {
            "25000": 19.68,
            "50000": 22.95,
            "100000": 27.64,
            "150000": 32.25,
            "250000": 39.17,
        }
    };
    const [pricingMatrix, setPricingMatrix] = useState(() => {
        try {
            const stored = localStorage.getItem('insurancePricingMatrix');
            if (stored) return JSON.parse(stored);
        } catch { }
        return defaultPricing;
    });

    // Add state for editing germanyGreenMERates
    const [germanyRates, setGermanyRates] = useState(() => ({ ...defaultPricing.germanyGreenMERates }));
    // When pricingMatrix changes, sync germanyRates
    useEffect(() => {
        if (pricingMatrix.germanyGreenMERates) setGermanyRates({ ...pricingMatrix.germanyGreenMERates });
    }, [pricingMatrix]);
    // Handler for updating a germanyGreenMERates value
    const handleGermanyRateChange = (coverage: string, value: string) => {
        setGermanyRates(prev => ({ ...prev, [coverage]: value }));
    };
    const handleGermanyRatesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updated = { ...pricingMatrix, germanyGreenMERates: { ...germanyRates } };
        setPricingMatrix(updated);
        localStorage.setItem('insurancePricingMatrix', JSON.stringify(updated));
        setStatusMsg('Germany Green ME rates updated');
    };

    // Helper to get the current price for the selected zone/level/coverage
    const getCurrentPrice = () => {
        if (zone === 'Transit') return pricingMatrix.transitCost;
        const levelMap = { Base: 'ME', Medical: 'ME', Accident: 'PA' } as const;
        const zoneMap = { Green: 'green', Amber: 'amber', Red: 'red', Black: 'black' } as const;
        const field = `${zoneMap[zone as keyof typeof zoneMap]}${levelMap[level as keyof typeof levelMap]}`;
        return pricingMatrix.matrix[coverage][field];
    };

    // When zone/level/coverage changes, update price input
    useEffect(() => {
        setPrice(getCurrentPrice()?.toString() || '');
    }, [zone, level, coverage, pricingMatrix]);

    useEffect(() => {
        try {
            const storedSubmissionsString = localStorage.getItem("insuranceSubmissions");
            if (storedSubmissionsString) {
                const parsedSubmissions = JSON.parse(storedSubmissionsString) as StoredSubmission[];
                // Sort by most recent first
                parsedSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
                setSubmissions(parsedSubmissions);
            }
        } catch (error) {
            console.error("Error loading submissions from localStorage:", error);
            // Optionally, set an error state to display to the user
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("insuranceFormData");
            if (stored) {
                // Accept both array and single object for backward compatibility
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let parsed: any[] = [];
                const data = JSON.parse(stored);
                if (Array.isArray(data)) {
                    parsed = data;
                } else if (typeof data === "object" && data !== null) {
                    parsed = [data];
                }
                // Sort by most recent if possible
                parsed.sort((a, b) => {
                    const aDate = new Date(a.submittedAt || a.timestamp || a.createdAt || 0).getTime();
                    const bDate = new Date(b.submittedAt || b.timestamp || b.createdAt || 0).getTime();
                    return bDate - aDate;
                });
                setPurchases(parsed);
            } else {
                setPurchases([]);
            }
        } catch (error) {
            console.error("Error loading purchases from localStorage:", error);
            setPurchases([]);
        }
    }, []);

    const handleDeleteAllSubmissions = () => {
        if (window.confirm("Are you sure you want to delete all submissions? This cannot be undone.")) {
            localStorage.removeItem("insuranceSubmissions");
            setSubmissions([]);
        }
    };

    // Filtered purchases
    const filteredPurchases = purchases.filter((purchase) => {
        const filter = purchaseFilter.toLowerCase();
        return (
            (purchase.c_email && purchase.c_email.toLowerCase().includes(filter)) ||
            (purchase.c_first_name && purchase.c_first_name.toLowerCase().includes(filter)) ||
            (purchase.c_last_name && purchase.c_last_name.toLowerCase().includes(filter)) ||
            (purchase.city_of_residence && purchase.city_of_residence.toLowerCase().includes(filter)) ||
            (purchase.trip_countries && Array.isArray(purchase.trip_countries) && purchase.trip_countries.join(",").toLowerCase().includes(filter))
        );
    });

    const handlePricingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            const updated = { ...pricingMatrix };
            if (zone === 'Transit') {
                updated.transitCost = parseFloat(price);
            } else {
                const levelMap = { Base: 'ME', Medical: 'ME', Accident: 'PA' } as const;
                const zoneMap = { Green: 'green', Amber: 'amber', Red: 'red', Black: 'black' } as const;
                const field = `${zoneMap[zone as keyof typeof zoneMap]}${levelMap[level as keyof typeof levelMap]}`;
                updated.matrix[coverage][field] = parseFloat(price);
            }
            setPricingMatrix(updated);
            localStorage.setItem('insurancePricingMatrix', JSON.stringify(updated));
            setStatusMsg(`Price for ${zone} (${level}, ${coverage}) updated to €${price}`);
            setIsSubmitting(false);
        }, 800);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedPurchase, setSelectedPurchase] = useState<any | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    if (isLoading) {
        return <div className="container mx-auto p-4">Loading submissions...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="sidebar w-64 bg-white border-r flex flex-col justify-between min-h-screen">
                <div>

                    <nav className="sidebar-nav mt-6">
                        <ul className="space-y-2">
                            <li>
                                <button
                                    className={`sidebar-link w-full text-left px-6 py-2 rounded transition font-medium ${activeMenu === 'insurance' ? 'bg-[#1A2C50] text-white' : 'text-[#1A2C50] hover:bg-gray-100'}`}
                                    onClick={() => setActiveMenu('insurance')}
                                >
                                    Membership - all
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`sidebar-link w-full text-left px-6 py-2 rounded transition font-medium ${activeMenu === 'prices' ? 'bg-[#1A2C50] text-white' : 'text-[#1A2C50] hover:bg-gray-100'}`}
                                    onClick={() => setActiveMenu('prices')}
                                >
                                    Manage Prices
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="sidebar-footer-graphic h-16 bg-gradient-to-t from-[#00BBD3] to-transparent w-full" />
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-0 md:p-8">
                {activeMenu === 'insurance' && (
                    <div>
                        <div className="container mx-auto p-4 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-[#1A2C50]">Membership Sales</h1>
                                {submissions.length > 0 && (
                                    <Button variant="destructive" onClick={handleDeleteAllSubmissions}>
                                        Delete All Submissions
                                    </Button>
                                )}
                            </div>

                            {/* View Purchases Table */}
                            <div className="admin-widget mb-8">
                                <h3 className="text-lg font-semibold mb-2">Search Members</h3>
                                <div className="widget-content">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                                        <input
                                            type="text"
                                            className="border rounded px-3 py-2 text-sm w-full md:w-64"
                                            placeholder="Search by email, name, or country..."
                                            value={purchaseFilter}
                                            onChange={e => setPurchaseFilter(e.target.value)}
                                        />
                                        {/* <button className="btn btn-secondary btn-small" onClick={() => alert('Download CSV not implemented yet.')}>Download CSV</button> */}
                                    </div>
                                    <div className="table-wrapper admin-table-wrapper overflow-x-auto">
                                        <table className="min-w-full border text-sm" id="purchases-table">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="px-3 py-2 border">ID</th>
                                                    <th className="px-3 py-2 border">First Name</th>
                                                    <th className="px-3 py-2 border">Last Name</th>
                                                    <th className="px-3 py-2 border">Email</th>
                                                    <th className="px-3 py-2 border">Zones</th>
                                                    <th className="px-3 py-2 border">Traveling Dates</th>
                                                    <th className="px-3 py-2 border">Price</th>
                                                    <th className="px-3 py-2 border">Payment Status</th>
                                                    <th className="px-3 py-2 border">Membership Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredPurchases.length === 0 ? (
                                                    <tr><td colSpan={7} className="text-center text-gray-400 py-4">No purchases found.</td></tr>
                                                ) : (
                                                    filteredPurchases.map((purchase, idx) => (
                                                        <tr key={idx} className="border-b">
                                                            <td className="px-3 py-2 border">{idx + 1}</td>
                                                            <td className="px-3 py-2 border">{purchase.c_first_name || '-'}</td>
                                                            <td className="px-3 py-2 border">{purchase.c_last_name || '-'}</td>
                                                            <td className="px-3 py-2 border">{purchase.c_email}</td>
                                                            <td className="px-3 py-2 border">{[purchase.green_zone_days, purchase.amber_zone_days, purchase.red_zone_days].map((z, i) => `${['G', 'A', 'R'][i]}-${z}`).join(", ")}</td>
                                                            <td className="px-3 py-2 border">{purchase.trip_start_date} to {purchase.trip_end_date}</td>
                                                            <td className="px-3 py-2 border">{purchase.quote && purchase.quote.data && typeof purchase.quote.data.totalAmount === 'number' ? formatEuroAdmin(purchase.quote.data.totalAmount) : '-'}</td>
                                                            <td className="px-3 py-2 border">Pending</td>
                                                            <td className="px-3 py-2 border"><button className="btn btn-secondary btn-small" onClick={() => { setSelectedPurchase(purchase); setIsDrawerOpen(true); }}>View</button></td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Submissions Grid */}
                            {(submissions.length === 0 && purchases.length === 0) ? (
                                <p className="text-center text-gray-500">No submissions yet.</p>
                            ) : (
                                submissions.length > 0 && (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {submissions.map((submission, index) => (
                                            <Card key={index} className="shadow-lg">
                                                <CardHeader>
                                                    <CardTitle>
                                                        Submission for: {submission.formData.c_first_name} {submission.formData.c_last_name}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Submitted on: {new Date(submission.submittedAt).toLocaleString()}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-gray-600">Trip Details:</h4>
                                                        <p><strong>Dates:</strong> {submission.formData.trip_start_date} to {submission.formData.trip_end_date}</p>
                                                        <p><strong>Country of Residence:</strong> {submission.formData.city_of_residence}</p>
                                                        <p><strong>Travelling To:</strong> {submission.formData.trip_countries?.join(", ")}</p>
                                                        <p><strong>Purpose:</strong> {submission.formData.trip_purpose}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-gray-600">Contact:</h4>
                                                        <p><strong>Email:</strong> {submission.formData.c_email}</p>
                                                        <p><strong>Phone:</strong> {submission.formData.c_phone}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-gray-600">Travellers ({submission.formData.travellers?.length || 0}):</h4>
                                                        <ul className="list-disc list-inside pl-2 text-sm">
                                                            {submission.formData.travellers?.map((traveller, tIndex) => (
                                                                <li key={tIndex}>{traveller.first_name} {traveller.last_name} (DOB: {traveller.birthdate})</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    {submission.quote && submission.quote.ok && submission.quote.data && (
                                                        <div>
                                                            <h4 className="font-semibold text-sm text-gray-600">Quote Details:</h4>
                                                            <p><strong>Total Amount:</strong> {formatEuroAdmin(submission.quote.data.totalAmount)}</p>
                                                            <p><strong>Medical Coverage:</strong> {submission.formData.emergency_medical_coverage} ({formatEuroAdmin(submission.quote.data.medicalCoverAmount)})</p>
                                                            <p><strong>PA Coverage:</strong> {submission.formData.personal_accident_coverage_level} ({formatEuroAdmin(submission.quote.data.paCoverAmount)})</p>
                                                            <p><strong>Transit:</strong> {submission.formData.add_transit_coverage ? "Yes" : "No"}</p>
                                                        </div>
                                                    )}
                                                    {!submission.quote || !submission.quote.ok && (
                                                        <div>
                                                            <h4 className="font-semibold text-sm text-gray-600">Quote Status:</h4>
                                                            <p className="text-red-600">{submission.quote?.message || "Quote not available or error."}</p>
                                                        </div>
                                                    )}
                                                </CardContent>
                                                <CardFooter>
                                                    <p className="text-xs text-gray-500">Affiliate Code: {submission.formData.affiliate_code || "N/A"}</p>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
                {activeMenu === 'prices' && (
                    <div className="container mx-auto p-4">
                        <div className="admin-widget mb-8">
                            <h3 className="text-lg font-semibold mb-2">Manage Pricing</h3>
                            <div className="widget-content">
                                <form id="update-pricing-form" onSubmit={handlePricingSubmit} className="space-y-4">
                                    <div className="form-group flex flex-col md:flex-row md:items-center gap-2">
                                        <label htmlFor="price-zone" className="w-24 font-medium">Zone:</label>
                                        <select id="price-zone" required value={zone} onChange={e => setZone(e.target.value)} className="border rounded px-3 py-2 w-full md:w-48">
                                            <option>Green</option>
                                            <option>Amber</option>
                                            <option>Red</option>
                                            <option>Transit</option>
                                        </select>
                                    </div>
                                    {zone !== 'Transit' && (
                                        <div className="form-group flex flex-col md:flex-row md:items-center gap-2">
                                            <label htmlFor="coverage-amount" className="w-24 font-medium">Coverage:</label>
                                            <select id="coverage-amount" required value={coverage} onChange={e => setCoverage(e.target.value)} className="border rounded px-3 py-2 w-full md:w-48">
                                                <option value="25000">25000</option>
                                                <option value="50000">50000</option>
                                                <option value="100000">100000</option>
                                                <option value="150000">150000</option>
                                                <option value="250000">250000</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="form-group flex flex-col md:flex-row md:items-center gap-2">
                                        <label htmlFor="coverage-level" className="w-24 font-medium">Level:</label>
                                        <select id="coverage-level" required value={level} onChange={e => setLevel(e.target.value)} className="border rounded px-3 py-2 w-full md:w-48">
                                            <option>Base</option>
                                            <option>Medical</option>
                                            <option>Accident</option>
                                        </select>
                                    </div>
                                    <div className="form-group flex flex-col md:flex-row md:items-center gap-2">
                                        <label htmlFor="price-value" className="w-24 font-medium">Price (€):</label>
                                        <input type="number" id="price-value" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="border rounded px-3 py-2 w-full md:w-48" />
                                    </div>
                                    <div className="form-actions flex justify-end">
                                        <button type="submit" className="btn btn-primary px-6 py-2 bg-[#1A2C50] text-white rounded disabled:opacity-60 flex items-center gap-2" disabled={isSubmitting}>
                                            <span className="btn-text">Update</span>
                                            {isSubmitting && <span className="loading-spinner animate-spin border-2 border-t-2 border-t-white border-white rounded-full w-4 h-4"></span>}
                                        </button>
                                    </div>
                                    <div className="status-message text-green-600 min-h-[1.5em]">{statusMsg}</div>
                                </form>
                                {/* New section for Germany Green ME Rates */}
                                <form onSubmit={handleGermanyRatesSubmit} className="space-y-4 mt-8">
                                    <h4 className="font-semibold">Germany Green ME Rates</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.keys(germanyRates).map(key => (
                                            <div key={key} className="flex flex-col">
                                                <label className="font-medium mb-1">{key}:</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={germanyRates[key as keyof typeof germanyRates]}
                                                    onChange={e => handleGermanyRateChange(key, e.target.value)}
                                                    className="border rounded px-3 py-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-actions flex justify-end">
                                        <button type="submit" className="btn btn-primary px-6 py-2 bg-[#1A2C50] text-white rounded">Update Germany Rates</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            {isDrawerOpen && selectedPurchase && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30"
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="ml-auto w-full max-w-md bg-white shadow-lg h-full overflow-y-auto transition-transform duration-300 transform translate-x-0">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Purchase Details</h2>
                            <button
                                className="text-gray-500 hover:text-gray-800"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Basic Info */}
                            <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
                            <div className="grid grid-cols-1 gap-2 mb-4">
                                <div><strong>First Name:</strong> {selectedPurchase.c_first_name || '-'}</div>
                                <div><strong>Last Name:</strong> {selectedPurchase.c_last_name || '-'}</div>
                                <div><strong>Email:</strong> {selectedPurchase.c_email || '-'}</div>
                                <div><strong>Country of Residence:</strong> {selectedPurchase.city_of_residence || '-'}</div>
                                <div><strong>Affiliate Code:</strong> {selectedPurchase.affiliate_code || '-'}</div>
                            </div>

                            {/* Trip Info */}
                            <h3 className="text-lg font-semibold mb-2">Trip Info</h3>
                            <div className="grid grid-cols-1 gap-2 mb-4">
                                <div><strong>Trip Dates:</strong> {selectedPurchase.trip_start_date || '-'} to {selectedPurchase.trip_end_date || '-'}</div>
                                <div><strong>Countries:</strong> {Array.isArray(selectedPurchase.trip_countries) ? selectedPurchase.trip_countries.join(', ') : (selectedPurchase.trip_countries || '-')}</div>
                                <div><strong>Purpose:</strong> {selectedPurchase.trip_purpose || '-'}</div>
                                <div><strong>Zone Days:</strong> G-{selectedPurchase.green_zone_days || 0}, A-{selectedPurchase.amber_zone_days || 0}, R-{selectedPurchase.red_zone_days || 0}, B-{selectedPurchase.black_zone_days || 0}</div>
                                <div><strong>Coverage (Medical):</strong> {selectedPurchase.emergency_medical_coverage || '-'}</div>
                                <div><strong>Coverage (PA):</strong> {selectedPurchase.personal_accident_coverage_level || '-'}</div>
                                <div><strong>Transit Coverage:</strong> {selectedPurchase.add_transit_coverage ? 'Yes' : 'No'}</div>
                            </div>

                            {/* Travellers */}
                            {Array.isArray(selectedPurchase.travellers) && selectedPurchase.travellers.length > 0 && (
                                <>
                                    <h3 className="text-lg font-semibold mb-2">Travellers</h3>
                                    <div className="space-y-2 mb-4">

                                        {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            selectedPurchase.travellers.map((traveller: any, idx: number) => (
                                                <div key={idx} className="p-2 bg-gray-50 rounded border">
                                                    <div><strong>Name:</strong> {traveller.first_name} {traveller.last_name}</div>
                                                    <div><strong>Birthdate:</strong> {traveller.birthdate}</div>
                                                    <div><strong>Passport #:</strong> {traveller.passport_number}</div>
                                                    <div><strong>Passport Expiry:</strong> {traveller.passport_expiry_date}</div>
                                                </div>
                                            ))}
                                    </div>
                                </>
                            )}

                            {/* Quote */}
                            {selectedPurchase.quote && (
                                <>
                                    <h3 className="text-lg font-semibold mb-2">Quote</h3>
                                    <div className="grid grid-cols-1 gap-2 mb-4">
                                        <div><strong>Status:</strong> {selectedPurchase.quote.ok ? 'OK' : 'Error'}</div>
                                        <div><strong>Message:</strong> {selectedPurchase.quote.message}</div>
                                        {selectedPurchase.quote.data && (
                                            <>
                                                <div><strong>Total Amount:</strong> {formatEuroAdmin(selectedPurchase.quote.data.totalAmount)}</div>
                                                <div><strong>Medical Cover:</strong> {formatEuroAdmin(selectedPurchase.quote.data.medicalCoverAmount)}</div>
                                                <div><strong>PA Cover:</strong> {formatEuroAdmin(selectedPurchase.quote.data.paCoverAmount)}</div>
                                                <div><strong>Travellers Count:</strong> {selectedPurchase.quote.data.travellersCount}</div>
                                                <div><strong>Total Days:</strong> {selectedPurchase.quote.data.totalDays}</div>
                                            </>
                                        )}
                                        {selectedPurchase.quote.warnings && selectedPurchase.quote.warnings.length > 0 && (
                                            <div className="text-orange-600 text-xs"><strong>Warnings:</strong> <ul className="list-disc list-inside pl-4">{selectedPurchase.quote.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul></div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Emergency Contact */}
                            <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
                            <div className="grid grid-cols-1 gap-2 mb-4">
                                <div><strong>Name:</strong> {selectedPurchase.emergency_contact_first_name || '-'} {selectedPurchase.emergency_contact_last_name || '-'}</div>
                                <div><strong>Phone:</strong> {selectedPurchase.emergency_contact_phone || '-'}</div>
                                <div><strong>Relationship:</strong> {selectedPurchase.emergency_contact_relation || '-'}</div>
                            </div>

                            {/* Other details */}
                            <h3 className="text-lg font-semibold mb-2">Other Details</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(selectedPurchase).filter(([key]) => ![
                                    'c_first_name', 'c_last_name', 'c_email', 'city_of_residence', 'affiliate_code', 'trip_start_date', 'trip_end_date', 'trip_countries', 'trip_purpose', 'green_zone_days', 'amber_zone_days', 'red_zone_days', 'black_zone_days', 'emergency_medical_coverage', 'personal_accident_coverage_level', 'add_transit_coverage', 'travellers', 'quote', 'emergency_contact_first_name', 'emergency_contact_last_name', 'emergency_contact_phone', 'emergency_contact_relation'
                                ].includes(key)).map(([key, value]) => (
                                    <div key={key}>
                                        <strong>{key.replace(/^c_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {renderOtherDetailValue(value, key, selectedPurchase)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}