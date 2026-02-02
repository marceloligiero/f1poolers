
import React, { useState } from 'react';
import RoundSelector from './RaceSelector';
import Leaderboard from './Leaderboard';
import LeagueLeaderboard from './LeagueLeaderboard';
import BettingModal from './BettingModal';
import BetConfirmationModal from './BetConfirmationModal';
import HowToPlayModal from './HowToPlayModal';
import { Event, Round, Bet } from '../types';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { rounds } = useData();
  const { t } = useLanguage();
  const [selectedRound, setSelectedRound] = useState<Round | null>(rounds.length > 0 ? rounds[0] : null);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);
  const [bettingEvent, setBettingEvent] = useState<Event | null>(null);
  const [confirmedBet, setConfirmedBet] = useState<Bet | null>(null);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const handlePlaceBetClick = (event: Event) => {
    setBettingEvent(event);
    setIsBettingModalOpen(true);
  };

  const handleBetPlaced = (bet: Omit<Bet, 'id' | 'timestamp'>) => {
    setIsBettingModalOpen(false);
    setConfirmedBet({ ...bet, id: `bet-${Date.now()}`, timestamp: new Date() });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
          <button 
            onClick={() => setIsHowToPlayOpen(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white font-black py-2 px-6 rounded-full border border-red-600 shadow-lg text-xs transition-all flex items-center gap-2 uppercase italic"
          >
            <i className="fas fa-question-circle text-red-500"></i>
            {t('howToPlay')}
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rounds & Betting */}
        <div className="lg:col-span-8">
          <RoundSelector 
            selectedRound={selectedRound}
            onSelectRound={setSelectedRound}
            onPlaceBet={handlePlaceBetClick}
          />
        </div>
        
        {/* Right Column: Leaderboards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Leaderboard />
          <LeagueLeaderboard />
        </div>

        {isBettingModalOpen && bettingEvent && (
          <BettingModal
            event={bettingEvent}
            onClose={() => setIsBettingModalOpen(false)}
            onBetPlaced={handleBetPlaced}
          />
        )}

        {confirmedBet && bettingEvent && (
          <BetConfirmationModal 
              bet={confirmedBet}
              event={bettingEvent}
              onClose={() => setConfirmedBet(null)}
          />
        )}

        {isHowToPlayOpen && (
          <HowToPlayModal onClose={() => setIsHowToPlayOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
