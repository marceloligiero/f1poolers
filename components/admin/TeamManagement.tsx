import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Team } from '../../types';

const TeamManagement: React.FC = () => {
    const { teams, createTeam, updateTeam, deleteTeam } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [teamData, setTeamData] = useState({
        name: '',
        nationality: '',
        logoUrl: ''
    });

    const handleOpenModal = (team: Team | null) => {
        if (team) {
            setEditingTeam(team);
            setTeamData({
                name: team.name,
                nationality: team.nationality,
                logoUrl: team.logoUrl,
            });
        } else {
            setEditingTeam(null);
            setTeamData({ name: '', nationality: '', logoUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTeam(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTeam) {
            await updateTeam({ ...teamData, id: editingTeam.id });
        } else {
            await createTeam(teamData);
        }
        handleCloseModal();
    };

    const handleDelete = async (teamId: string) => {
        if (window.confirm('Are you sure you want to delete this team? This can only be done if no drivers are assigned to it.')) {
            try {
                await deleteTeam(teamId);
            } catch (error: any) {
                alert(error.message);
            }
        }
    };

    return (
        <>
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-red-500">Team Management</h2>
                <button onClick={() => handleOpenModal(null)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    <i className="fas fa-plus mr-2"></i> Add New Team
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-700 rounded-lg">
                    <thead>
                        <tr className="bg-gray-900">
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Team</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Nationality</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {teams.map((team) => (
                            <tr key={team.id} className="hover:bg-gray-600">
                                <td className="py-3 px-4 text-sm text-white flex items-center">
                                    <img src={team.logoUrl} alt={team.name} className="w-10 h-10 rounded-full mr-3" />
                                    {team.name}
                                </td>
                                <td className="py-3 px-4 text-sm text-white">{team.nationality}</td>
                                <td className="py-3 px-4 text-sm space-x-4">
                                    <button onClick={() => handleOpenModal(team)} className="text-blue-400 hover:text-blue-300" title="Edit Team"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDelete(team.id)} className="text-red-400 hover:text-red-300" title="Delete Team"><i className="fas fa-trash"></i></button>
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
                            <h2 className="text-xl font-bold text-white">{editingTeam ? 'Edit Team' : 'Create New Team'}</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Team Name</label>
                                <input type="text" value={teamData.name} onChange={e => setTeamData({...teamData, name: e.target.value})} className="w-full bg-gray-700 text-white rounded-md py-2 px-3" required />
                            </div>
                             <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Nationality</label>
                                <input type="text" value={teamData.nationality} onChange={e => setTeamData({...teamData, nationality: e.target.value})} className="w-full bg-gray-700 text-white rounded-md py-2 px-3" required />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Logo URL</label>
                                <input type="text" value={teamData.logoUrl} onChange={e => setTeamData({...teamData, logoUrl: e.target.value})} className="w-full bg-gray-700 text-white rounded-md py-2 px-3" required />
                            </div>
                        </div>
                        <div className="p-4 bg-gray-900 flex justify-end space-x-2">
                            <button type="button" onClick={handleCloseModal} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{editingTeam ? 'Update Team' : 'Create Team'}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
};

export default TeamManagement;
