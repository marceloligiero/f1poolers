// Script para inserir dados de teste completos no banco de dados
import { getDb, saveDatabase } from './database.js';

function seedTestData() {
  console.log('🌱 Seeding test data...\n');
  const db = getDb();
  
  try {
    // 1. Create additional test users
    console.log('1️⃣ Creating test users...');
    const testUsers = [
      ['user1', 'testuser1', 'pass123', 'https://picsum.photos/seed/user1/100/100', 500, 150, 0, 28, 'Brazil'],
      ['user2', 'testuser2', 'pass123', 'https://picsum.photos/seed/user2/100/100', 750, 320, 0, 32, 'United Kingdom'],
      ['user3', 'testuser3', 'pass123', 'https://picsum.photos/seed/user3/100/100', 300, 89, 0, 24, 'Spain'],
      ['user4', 'testuser4', 'pass123', 'https://picsum.photos/seed/user4/100/100', 1200, 550, 0, 35, 'Germany'],
      ['user5', 'testuser5', 'pass123', 'https://picsum.photos/seed/user5/100/100', 200, 45, 0, 21, 'Japan']
    ];
    
    testUsers.forEach(([id, username, password, avatar, balance, points, isAdmin, age, country]) => {
      try {
        db.run(`INSERT INTO users (id, username, password, avatar_url, balance, points, is_admin, age, country) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, username, password, avatar, balance, points, isAdmin, age, country]);
        
        // Add to global league
        db.run(`INSERT INTO league_members (league_id, user_id, status) VALUES ('global-league', ?, 'active')`, [id]);
        console.log(`   ✅ Created user: ${username}`);
      } catch (error: any) {
        if (!error.message.includes('UNIQUE constraint')) {
          console.log(`   ⚠️  User ${username} might already exist`);
        }
      }
    });
    console.log('');
    
    // 2. Create test rounds
    console.log('2️⃣ Creating test rounds...');
    const testRounds = [
      ['bahrain-2026', 'Bahrain Grand Prix', 'Sakhir', 'Bahrain', '2026-03-01', '2026-03-03', 1],
      ['saudi-2026', 'Saudi Arabian Grand Prix', 'Jeddah', 'Saudi Arabia', '2026-03-08', '2026-03-10', 2],
      ['australia-2026', 'Australian Grand Prix', 'Melbourne', 'Australia', '2026-03-22', '2026-03-24', 3],
      ['japan-2026', 'Japanese Grand Prix', 'Suzuka', 'Japan', '2026-04-05', '2026-04-07', 4],
      ['china-2026', 'Chinese Grand Prix', 'Shanghai', 'China', '2026-04-19', '2026-04-21', 5]
    ];
    
    testRounds.forEach(([id, name, location, country, startDate, endDate, roundNum]) => {
      try {
        db.run(`INSERT INTO rounds (id, name, location, country, start_date, end_date, round_number) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, name, location, country, startDate, endDate, roundNum]);
        console.log(`   ✅ Created round: ${name}`);
      } catch (error: any) {
        if (!error.message.includes('UNIQUE constraint')) {
          console.log(`   ⚠️  Round ${name} might already exist`);
        }
      }
    });
    console.log('');
    
    // 3. Create test events
    console.log('3️⃣ Creating test events...');
    const testEvents = [
      ['bahrain-fp1', 'bahrain-2026', 'practice', '2026-03-01T10:00:00Z', 'completed'],
      ['bahrain-fp2', 'bahrain-2026', 'practice', '2026-03-01T14:00:00Z', 'completed'],
      ['bahrain-fp3', 'bahrain-2026', 'practice', '2026-03-02T11:00:00Z', 'completed'],
      ['bahrain-quali', 'bahrain-2026', 'qualifying', '2026-03-02T14:00:00Z', 'completed'],
      ['bahrain-race', 'bahrain-2026', 'race', '2026-03-03T15:00:00Z', 'completed'],
      ['saudi-fp1', 'saudi-2026', 'practice', '2026-03-08T10:00:00Z', 'upcoming'],
      ['saudi-fp2', 'saudi-2026', 'practice', '2026-03-08T14:00:00Z', 'upcoming'],
      ['saudi-fp3', 'saudi-2026', 'practice', '2026-03-09T11:00:00Z', 'upcoming'],
      ['saudi-quali', 'saudi-2026', 'qualifying', '2026-03-09T14:00:00Z', 'upcoming'],
      ['saudi-race', 'saudi-2026', 'race', '2026-03-10T15:00:00Z', 'upcoming']
    ];
    
    testEvents.forEach(([id, roundId, type, time, status]) => {
      try {
        db.run(`INSERT INTO events (id, round_id, type, scheduled_time, status) 
                VALUES (?, ?, ?, ?, ?)`,
          [id, roundId, type, time, status]);
        console.log(`   ✅ Created event: ${id}`);
      } catch (error: any) {
        if (!error.message.includes('UNIQUE constraint')) {
          console.log(`   ⚠️  Event ${id} might already exist`);
        }
      }
    });
    console.log('');
    
    // 4. Create test bets
    console.log('4️⃣ Creating test bets...');
    const testBets = [
      ['bet1', 'user1', 'saudi-race', 'verstappen', 50, 75, '2026-03-09T10:00:00Z'],
      ['bet2', 'user2', 'saudi-race', 'leclerc', 100, 180, '2026-03-09T11:30:00Z'],
      ['bet3', 'user3', 'saudi-quali', 'norris', 30, 60, '2026-03-09T09:00:00Z'],
      ['bet4', 'user4', 'saudi-race', 'hamilton', 200, 320, '2026-03-09T12:00:00Z'],
      ['bet5', 'user5', 'saudi-race', 'piastri', 20, 45, '2026-03-09T13:00:00Z']
    ];
    
    testBets.forEach(([id, userId, eventId, driverId, amount, potentialReturn, placedAt]) => {
      try {
        db.run(`INSERT INTO bets (id, user_id, event_id, driver_id, amount, potential_return, placed_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, userId, eventId, driverId, amount, potentialReturn, placedAt]);
        console.log(`   ✅ Created bet: ${id}`);
      } catch (error: any) {
        if (!error.message.includes('UNIQUE constraint')) {
          console.log(`   ⚠️  Bet ${id} might already exist`);
        }
      }
    });
    console.log('');
    
    // 5. Create test results
    console.log('5️⃣ Creating test results...');
    const testResults = [
      ['result-bahrain-race-1', 'bahrain-race', 'verstappen', 1],
      ['result-bahrain-race-2', 'bahrain-race', 'leclerc', 2],
      ['result-bahrain-race-3', 'bahrain-race', 'norris', 3],
      ['result-bahrain-race-4', 'bahrain-race', 'hamilton', 4],
      ['result-bahrain-race-5', 'bahrain-race', 'piastri', 5],
      ['result-bahrain-quali-1', 'bahrain-quali', 'verstappen', 1],
      ['result-bahrain-quali-2', 'bahrain-quali', 'leclerc', 2],
      ['result-bahrain-quali-3', 'bahrain-quali', 'hamilton', 3]
    ];
    
    testResults.forEach(([id, eventId, driverId, position]) => {
      try {
        db.run(`INSERT INTO results (id, event_id, driver_id, position) 
                VALUES (?, ?, ?, ?)`,
          [id, eventId, driverId, position]);
        console.log(`   ✅ Created result: ${id}`);
      } catch (error: any) {
        if (!error.message.includes('UNIQUE constraint')) {
          console.log(`   ⚠️  Result ${id} might already exist`);
        }
      }
    });
    console.log('');
    
    // 6. Create test private leagues
    console.log('6️⃣ Creating test leagues...');
    const testLeagues = [
      ['league-friends', 'Friends League', 'Private league for close friends', 'user1', 1, 'FRIENDS2026', new Date().toISOString(), 1],
      ['league-office', 'Office Racing', 'Workplace F1 competition', 'user2', 1, 'OFFICE123', new Date().toISOString(), 1],
      ['league-family', 'Family Grand Prix', 'Family betting pool', 'user3', 0, 'PUBLIC', new Date().toISOString(), 0]
    ];
    
    testLeagues.forEach(([id, name, desc, adminId, isPrivate, inviteCode, createdAt, hasChat]) => {
      try {
        db.run(`INSERT INTO leagues (id, name, description, admin_id, is_private, invite_code, created_at, has_chat) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, name, desc, adminId, isPrivate, inviteCode, createdAt, hasChat]);
        
        // Add admin as member
        db.run(`INSERT INTO league_members (league_id, user_id, status) VALUES (?, ?, 'active')`, [id, adminId]);
        
        console.log(`   ✅ Created league: ${name}`);
      } catch (error: any) {
        if (!error.message.includes('UNIQUE constraint')) {
          console.log(`   ⚠️  League ${name} might already exist`);
        }
      }
    });
    console.log('');
    
    // 7. Add members to test leagues
    console.log('7️⃣ Adding league members...');
    const leagueMembers = [
      ['league-friends', 'user2'],
      ['league-friends', 'user3'],
      ['league-office', 'user1'],
      ['league-office', 'user4'],
      ['league-family', 'user1'],
      ['league-family', 'user2'],
      ['league-family', 'user4'],
      ['league-family', 'user5']
    ];
    
    leagueMembers.forEach(([leagueId, userId]) => {
      try {
        db.run(`INSERT INTO league_members (league_id, user_id, status) VALUES (?, ?, 'active')`, [leagueId, userId]);
        console.log(`   ✅ Added user ${userId} to ${leagueId}`);
      } catch (error: any) {
        if (!error.message.includes('UNIQUE constraint')) {
          console.log(`   ⚠️  Member might already exist`);
        }
      }
    });
    console.log('');
    
    // 8. Create test notifications
    console.log('8️⃣ Creating test notifications...');
    const testNotifications = [
      ['notif1', 'user1', 'Your bet on Verstappen won! +25 coins', new Date().toISOString(), 0],
      ['notif2', 'user2', 'Welcome to F1™ Poolers!', new Date().toISOString(), 1],
      ['notif3', 'user3', 'New race available: Saudi Arabian GP', new Date().toISOString(), 0],
      ['notif4', 'user4', 'You joined Office Racing league', new Date().toISOString(), 1]
    ];
    
    testNotifications.forEach(([id, userId, message, timestamp, isRead]) => {
      try {
        db.run(`INSERT INTO notifications (id, user_id, message, timestamp, is_read) 
                VALUES (?, ?, ?, ?, ?)`,
          [id, userId, message, timestamp, isRead]);
        console.log(`   ✅ Created notification for ${userId}`);
      } catch (error: any) {
        if (!error.message.includes('UNIQUE constraint')) {
          console.log(`   ⚠️  Notification might already exist`);
        }
      }
    });
    console.log('');
    
    // Save database
    saveDatabase();
    
    console.log('✅ Test data seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('   - 5 test users created');
    console.log('   - 5 rounds created');
    console.log('   - 10 events created');
    console.log('   - 5 bets created');
    console.log('   - 8 results created');
    console.log('   - 3 private leagues created');
    console.log('   - League memberships assigned');
    console.log('   - 4 notifications created\n');
    
  } catch (error: any) {
    console.error('❌ Error seeding data:', error.message);
  }
}

export { seedTestData };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('./database.js').then(async ({ initDatabase }) => {
    await initDatabase();
    seedTestData();
    process.exit(0);
  });
}
