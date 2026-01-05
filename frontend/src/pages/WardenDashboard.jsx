import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Check, X, Shield, Filter } from 'lucide-react';

export default function WardenDashboard() {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [leaves, setLeaves] = useState([]);
    const [filter, setFilter] = useState('All');
    const token = localStorage.getItem('token');

    const fetchLeaves = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/leaves/all`, {
                headers: { 'x-auth-token': token }
            });
            setLeaves(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load leaves');
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleAction = async (id, status, currentComments) => {
        const comments = prompt("Add a comment (optional):", currentComments || "");
        if (comments === null) return;

        try {
            await axios.put(`${API_URL}/api/leaves/${id}`,
                { status, comments },
                { headers: { 'x-auth-token': token } }
            );
            toast.success(`Leave request ${status}`);
            fetchLeaves();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const filteredLeaves = filter === 'All' ? leaves : leaves.filter(l => l.status === filter);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-blue-600" />
                    Student Leave Requests
                </h2>
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        className="border-none bg-transparent font-medium text-gray-600 focus:ring-0 cursor-pointer"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Requests</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredLeaves.map((leave) => (
                    <div key={leave._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 mr-3">
                                    {leave.student.name} <span className="text-sm font-normal text-gray-500">({leave.registerNumber || 'No Reg No'})</span>
                                </h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                                    ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'}`}>
                                    {leave.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                                <div><span className="font-medium">Dept:</span> {leave.department} - {leave.yearOfStudy} Yr</div>
                                <div><span className="font-medium">Room:</span> {leave.roomNumber}</div>
                                <div><span className="font-medium">Mobile:</span> {leave.studentMobile}</div>
                                <div><span className="font-medium">Days:</span> {leave.numberOfDays}</div>
                                <div><span className="font-medium">Out:</span> {leave.outTime}</div>
                                <div className="col-span-2 md:col-span-1"><span className="font-medium">Floor In Charge:</span> {leave.floorInCharge}</div>
                            </div>
                            <p className="text-gray-800 font-medium mb-1">Reason: {leave.reason}</p>
                            <div className="text-sm text-gray-500 flex space-x-4">
                                <span>From: {new Date(leave.fromDate).toLocaleDateString()}</span>
                                <span>To: {new Date(leave.toDate).toLocaleDateString()}</span>
                            </div>
                            {leave.comments && (
                                <p className="text-sm text-gray-500 mt-2 italic">Note: {leave.comments}</p>
                            )}
                        </div>

                        {leave.status === 'Pending' && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleAction(leave._id, 'Approved', leave.comments)}
                                    className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                                >
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                </button>
                                <button
                                    onClick={() => handleAction(leave._id, 'Rejected', leave.comments)}
                                    className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                                >
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
