
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

const AdManagement: React.FC = () => {
    const { adSettings, updateAdSettings } = useData();
    
    // Ad Settings State
    const [googleClientId, setGoogleClientId] = useState('');
    const [rewardAmount, setRewardAmount] = useState(0);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        if (adSettings) {
            setGoogleClientId(adSettings.googleAdClientId);
            setRewardAmount(adSettings.rewardAmount);
            setIsEnabled(adSettings.isEnabled);
        }
    }, [adSettings]);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateAdSettings({
            googleAdClientId: googleClientId,
            rewardAmount: Number(rewardAmount),
            isEnabled
        });
        alert('Ad settings updated successfully.');
    };

    return (
        <div className="space-y-6">
            {/* Ad Configuration Section */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border-l-4 border-yellow-500">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white"><i className="fas fa-ad mr-2"></i> Ad Configuration</h2>
                    <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">Manage free coin rewards for users</p>
                </div>
                
                <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-xs font-black uppercase mb-2 tracking-widest">Google Ad Client ID</label>
                            <input 
                                type="text" 
                                value={googleClientId} 
                                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                                onChange={e => setGoogleClientId(e.target.value)}
                                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs font-black uppercase mb-2 tracking-widest">Reward Amount (Fun-Coins)</label>
                            <input 
                                type="number" 
                                value={rewardAmount} 
                                onChange={e => setRewardAmount(Number(e.target.value))}
                                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center bg-gray-900/50 p-4 rounded border border-gray-700">
                        <input 
                            type="checkbox" 
                            id="enableAds"
                            checked={isEnabled} 
                            onChange={e => setIsEnabled(e.target.checked)}
                            className="mr-3 h-5 w-5 text-yellow-500 rounded bg-gray-700 border-gray-600 focus:ring-yellow-500 transition-all" 
                        />
                        <label htmlFor="enableAds" className="text-white font-bold cursor-pointer select-none">Enable "Watch & Earn" Rewards for Users</label>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-black py-2 px-8 rounded uppercase italic tracking-widest transition-all shadow-lg shadow-red-900/20 active:scale-95">
                            Save Ad Settings
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 opacity-60">
                <p className="text-gray-400 text-sm italic text-center">
                    <i className="fas fa-info-circle mr-2"></i> Note: Coin selling features have been disabled. Users can only acquire Fun-Coins through Round bonuses or by watching ads.
                </p>
            </div>
        </div>
    );
};

export default AdManagement;
