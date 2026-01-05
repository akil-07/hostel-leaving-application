import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function StudentDashboard() {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [formData, setFormData] = useState({
        registerNumber: '',
        yearOfStudy: '',
        department: '',
        studentMobile: '',
        parentMobile: '',
        roomNumber: '',
        floorInCharge: '',
        numberOfDays: 1,
        fromDate: '',
        outTime: '',
        toDate: '',
        reason: ''
    });
    const [leaves, setLeaves] = useState([]);

    const token = localStorage.getItem('token');

    const fetchLeaves = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/leaves/my-leaves`, {
                headers: { 'x-auth-token': token }
            });
            setLeaves(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/leaves`,
                formData,
                { headers: { 'x-auth-token': token } }
            );
            toast.success('Leave request submitted!');
            setFormData({
                registerNumber: '',
                yearOfStudy: '',
                department: '',
                studentMobile: '',
                parentMobile: '',
                roomNumber: '',
                floorInCharge: '',
                numberOfDays: 1,
                fromDate: '',
                outTime: '',
                toDate: '',
                reason: ''
            });
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to submit leave request');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-green-600 bg-green-50 border-green-200';
            case 'Rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="w-5 h-5 mr-1" />;
            case 'Rejected': return <XCircle className="w-5 h-5 mr-1" />;
            default: return <Clock className="w-5 h-5 mr-1" />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Apply for Leave
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Register / Admission Number</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.registerNumber}
                                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.yearOfStudy}
                                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                            >
                                <option value="">Choose...</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="">Choose...</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="MECH">MECH</option>
                                <option value="IT">IT</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="AIDS">AI & DS</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.roomNumber}
                                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student Mobile Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.studentMobile}
                                onChange={(e) => setFormData({ ...formData, studentMobile: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Mobile Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.parentMobile}
                                onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Floor In Charge</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.floorInCharge}
                                onChange={(e) => setFormData({ ...formData, floorInCharge: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">No. of Days Leave Applied</label>
                        <div className="flex flex-wrap gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <label key={num} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="numberOfDays"
                                        value={num}
                                        checked={parseInt(formData.numberOfDays) === num}
                                        onChange={(e) => setFormData({ ...formData, numberOfDays: parseInt(e.target.value) })}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{num}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Leaving Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.fromDate}
                                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Out Time</label>
                            <input
                                type="time"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.outTime}
                                onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Return</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.toDate}
                                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Why do you need leave?"
                            rows="3"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md text-lg"
                    >
                        Submit Request
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    My Leave History
                </h2>
                {leaves.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No leave requests found.</p>
                ) : (
                    leaves.map((leave) => (
                        <div key={leave._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`flex items-center text-sm font-medium px-2 py-1 rounded-full border ${getStatusColor(leave.status)}`}>
                                    {getStatusIcon(leave.status)}
                                    {leave.status}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(leave.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-800 font-medium mb-1">{leave.reason}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(leave.fromDate).toLocaleDateString()} — {new Date(leave.toDate).toLocaleDateString()}
                            </p>
                            {leave.comments && (
                                <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-200">
                                    <span className="font-semibold text-gray-700">Warden's Note:</span> {leave.comments}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
