
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

const MessagingSystem: React.FC = () => {
    const { users, sendNotification } = useData();
    const [message, setMessage] = useState('');
    const [targetType, setTargetType] = useState<'all' | 'user' | 'filter'>('all');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({
        minAge: '',
        maxAge: '',
        country: ''
    });
    const [sending, setSending] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            const criteria = targetType === 'filter' ? {
                minAge: filterCriteria.minAge ? Number(filterCriteria.minAge) : undefined,
                maxAge: filterCriteria.maxAge ? Number(filterCriteria.maxAge) : undefined,
                country: filterCriteria.country || undefined
            } : undefined;

            await sendNotification({
                type: targetType,
                userId: targetType === 'user' ? selectedUserId : undefined,
                criteria
            }, message);
            
            alert('Message sent successfully!');
            setMessage('');
        } catch (error) {
            console.error(error);
            alert('Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-red-500 mb-6">Messaging System</h2>
            
            <form onSubmit={handleSend} className="space-y-6">
                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2">Recipient</label>
                    <div className="flex space-x-4 mb-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" checked={targetType === 'all'} onChange={() => setTargetType('all')} className="text-red-600 focus:ring-red-500" />
                            <span className="text-white">All Users</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" checked={targetType === 'user'} onChange={() => setTargetType('user')} className="text-red-600 focus:ring-red-500" />
                            <span className="text-white">Specific User</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" checked={targetType === 'filter'} onChange={() => setTargetType('filter')} className="text-red-600 focus:ring-red-500" />
                            <span className="text-white">Filter (Age/Country)</span>
                        </label>
                    </div>

                    {targetType === 'user' && (
                        <select 
                            value={selectedUserId} 
                            onChange={e => setSelectedUserId(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            required
                        >
                            <option value="">Select a user...</option>
                            {users.filter(u => !u.isAdmin).map(u => (
                                <option key={u.id} value={u.id}>{u.username}</option>
                            ))}
                        </select>
                    )}

                    {targetType === 'filter' && (
                        <div className="grid grid-cols-3 gap-4 bg-gray-700 p-4 rounded-lg">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Min Age</label>
                                <input 
                                    type="number" 
                                    value={filterCriteria.minAge} 
                                    onChange={e => setFilterCriteria({...filterCriteria, minAge: e.target.value})}
                                    className="w-full bg-gray-600 text-white rounded px-2 py-1 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Max Age</label>
                                <input 
                                    type="number" 
                                    value={filterCriteria.maxAge} 
                                    onChange={e => setFilterCriteria({...filterCriteria, maxAge: e.target.value})}
                                    className="w-full bg-gray-600 text-white rounded px-2 py-1 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Country</label>
                                <input 
                                    type="text" 
                                    value={filterCriteria.country} 
                                    onChange={e => setFilterCriteria({...filterCriteria, country: e.target.value})}
                                    className="w-full bg-gray-600 text-white rounded px-2 py-1 text-sm"
                                    placeholder="e.g., UK"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2">Message</label>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={4}
                        className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        placeholder="Type your message here..."
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={sending}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors disabled:bg-gray-600"
                    >
                        {sending ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessagingSystem;
