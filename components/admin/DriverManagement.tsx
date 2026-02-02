import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Driver } from '../../types';

const DriverManagement: React.FC = () => {
    const { drivers, teams, createDriver, updateDriver, deleteDriver } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [driverData, setDriverData] = useState({
        name: '',
        nationality: '',
        teamId: '',
        number: '',
        imageUrl: ''
    });

    const handleOpenModal = (driver: Driver | null) => {
        if (driver) {
            setEditingDriver(driver);
            setDriverData({
                name: driver.name,
                nationality: driver.nationality,
                teamId: driver.teamId,
                number: String(driver.number),
                imageUrl: driver.imageUrl,
            });
        } else {
            setEditingDriver(null);
            setDriverData({ name: '', nationality: '', teamId: teams[0]?.id || '', number: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDriver(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...driverData,
            number: Number(driverData.number)
        };
        if (editingDriver) {
            await updateDriver({ ...payload, id: editingDriver.id });
        } else {
            await createDriver(payload);
        }
        handleCloseModal();
    };

    const handleDelete = async (driverId: string) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            await deleteDriver(driverId);
        }
    };

    return (
        <>
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-red-500">Driver Management</h2>
                <button onClick={() => handleOpenModal(null)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    <i className="fas fa-plus mr-2"></i> Add New Driver
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-700 rounded-lg">
                    <thead>
                        <tr className="bg-gray-900">
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Driver</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Nationality</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Team</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Number</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {drivers.map((driver) => (
                            <tr key={driver.id} className="hover:bg-gray-600">
                                <td className="py-3 px-4 text-sm text-white flex items-center">
                                    <img src={driver.imageUrl} alt={driver.name} className="w-10 h-10 rounded-full mr-3" />
                                    {driver.name}
                                </td>
                                <td className="py-3 px-4 text-sm text-white">{driver.nationality}</td>
                                <td className="py-3 px-4 text-sm text-white">{driver.teamName}</td>
                                <td className="py-3 px-4 text-sm text-white">{driver.number}</td>
                                <td className="py-3 px-4 text-sm space-x-4">
                                    <button onClick={() => handleOpenModal(driver)} className="text-blue-400 hover:text-blue-300" title="Edit Driver"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDelete(driver.id)} className="text-red-400 hover:text-red-300" title="Delete Driver"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="p-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">{editingDriver ? 'Edit Driver' : 'Create New Driver'}</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Full Name</label>
                                <input type="text" value={driverData.name} onChange={e => setDriverData({...driverData, name: e.target.value})} className="w-full bg-gray-700 text-white rounded-md py-2 px-3" required />
                            </div>
                             <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Nationality</label>
                                <input type="text" value={driverData.nationality} onChange={e => setDriverData({...driverData, nationality: e.target.value})} className="w-full bg-gray-700 text-white rounded-md py-2 px-3" required />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Team</label>
                                <select value={driverData.teamId} onChange={e => setDriverData({...driverData, teamId: e.target.value})} className="w-full bg-gray-700 text-white rounded-md py-2 px-3" required>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Number</label>
                                    <input type="number" value={driverData.number} onChange={e => setDriverData({...driverData, number: e.target.value})} className="w-full bg-gray-700 text-white rounded-md py-2 px-3" required />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Image URL</label>
                                    <input type="text" value={driverData.imageUrl} onChange={e => setDriverData({...driverData, imageUrl: e.target.value})} className="w-full bg-gray-700 text-white rounded-md py-2 px-3" required />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-900 flex justify-end space-x-2">
                            <button type="button" onClick={handleCloseModal} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{editingDriver ? 'Update Driver' : 'Create Driver'}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
};

export default DriverManagement;
