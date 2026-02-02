
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { User } from '../../types';

const UserManagement: React.FC = () => {
    const { users, updateUser } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        balance: 0,
        points: 0,
        age: 0,
        country: ''
    });

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            balance: user.balance,
            points: user.points,
            age: user.age || 18,
            country: user.country || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            await updateUser({
                id: editingUser.id,
                username: formData.username,
                balance: Number(formData.balance),
                points: Number(formData.points),
                age: Number(formData.age),
                country: formData.country
            });
            setIsModalOpen(false);
        } catch (error) {
            alert('Failed to update user');
        }
    };

    const handleGrantCoins = async (user: User) => {
        const amount = prompt('Enter amount of coins to grant:');
        if (amount) {
            await updateUser({
                id: user.id,
                balance: user.balance + Number(amount)
            });
        }
    };

    return (
      <>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">User Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-900">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Username</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Age/Country</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Points</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Fun Coins</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-600">
                  <td className="py-3 px-4 text-sm text-white flex items-center">
                    <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full mr-3" />
                    {user.username}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                      {user.age ? `${user.age} / ${user.country}` : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-white">{user.points.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-yellow-400">{user.balance.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm space-x-4">
                    <button onClick={() => handleGrantCoins(user)} className="text-green-400 hover:text-green-300" title="Grant Fun Coins">
                        <i className="fas fa-coins"></i>
                    </button>
                    <button onClick={() => handleEdit(user)} className="text-blue-400 hover:text-blue-300" title="Edit User">
                        <i className="fas fa-user-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md">
                  <form onSubmit={handleSubmit}>
                      <div className="p-4 border-b border-gray-700">
                          <h2 className="text-xl font-bold text-white">Edit User: {editingUser?.username}</h2>
                      </div>
                      <div className="p-4 space-y-4">
                          <div>
                              <label className="block text-gray-400 text-sm font-bold mb-2">Username</label>
                              <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-gray-700 text-white rounded px-3 py-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Age</label>
                                <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} className="w-full bg-gray-700 text-white rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-2">Country</label>
                                <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-gray-700 text-white rounded px-3 py-2" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-gray-400 text-sm font-bold mb-2">Balance</label>
                                  <input type="number" value={formData.balance} onChange={e => setFormData({...formData, balance: Number(e.target.value)})} className="w-full bg-gray-700 text-white rounded px-3 py-2" />
                              </div>
                              <div>
                                  <label className="block text-gray-400 text-sm font-bold mb-2">Points</label>
                                  <input type="number" value={formData.points} onChange={e => setFormData({...formData, points: Number(e.target.value)})} className="w-full bg-gray-700 text-white rounded px-3 py-2" />
                              </div>
                          </div>
                      </div>
                      <div className="p-4 bg-gray-900 flex justify-end space-x-2">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Changes</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      </>
    );
  };
  
  export default UserManagement;
