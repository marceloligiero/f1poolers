// Script para testar todas as rotas da API
const API_URL = 'http://localhost:3001/api';

interface TestResult {
  endpoint: string;
  method: string;
  success: boolean;
  message: string;
  data?: any;
}

const results: TestResult[] = [];

async function testEndpoint(endpoint: string, method: string, body?: any): Promise<TestResult> {
  try {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      endpoint,
      method,
      success: response.ok,
      message: response.ok ? 'Success' : `Failed: ${response.status}`,
      data
    };
  } catch (error: any) {
    return {
      endpoint,
      method,
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  // 1. Health Check
  console.log('1️⃣ Testing Health Check...');
  const health = await testEndpoint('/health', 'GET');
  results.push(health);
  console.log(`   ${health.success ? '✅' : '❌'} ${health.message}\n`);
  
  // 2. Test Teams
  console.log('2️⃣ Testing Teams...');
  const teams = await testEndpoint('/teams', 'GET');
  results.push(teams);
  console.log(`   ${teams.success ? '✅' : '❌'} GET /teams - ${teams.success ? `Found ${teams.data?.length || 0} teams` : teams.message}\n`);
  
  // 3. Test Drivers
  console.log('3️⃣ Testing Drivers...');
  const drivers = await testEndpoint('/drivers', 'GET');
  results.push(drivers);
  console.log(`   ${drivers.success ? '✅' : '❌'} GET /drivers - ${drivers.success ? `Found ${drivers.data?.length || 0} drivers` : drivers.message}`);
  
  if (drivers.success && drivers.data && drivers.data.length > 0) {
    const firstDriver = drivers.data[0];
    const driver = await testEndpoint(`/drivers/${firstDriver.id}`, 'GET');
    results.push(driver);
    console.log(`   ${driver.success ? '✅' : '❌'} GET /drivers/:id - ${driver.success ? `Found ${driver.data?.name}` : driver.message}\n`);
  }
  
  // 4. Test Signup
  console.log('4️⃣ Testing User Signup...');
  const testUsername = `testuser_${Date.now()}`;
  const signup = await testEndpoint('/auth/signup', 'POST', {
    username: testUsername,
    password: 'test123',
    age: 25,
    country: 'Brazil'
  });
  results.push(signup);
  console.log(`   ${signup.success ? '✅' : '❌'} POST /auth/signup - ${signup.success ? `Created user: ${signup.data?.username}` : signup.message}\n`);
  
  let testUserId: string | null = null;
  if (signup.success && signup.data) {
    testUserId = signup.data.id;
  }
  
  // 5. Test Login
  console.log('5️⃣ Testing Login...');
  const login = await testEndpoint('/auth/login', 'POST', {
    username: testUsername,
    password: 'test123'
  });
  results.push(login);
  console.log(`   ${login.success ? '✅' : '❌'} POST /auth/login - ${login.message}\n`);
  
  // 6. Test Invalid Login
  console.log('6️⃣ Testing Invalid Login...');
  const invalidLogin = await testEndpoint('/auth/login', 'POST', {
    username: 'nonexistent',
    password: 'wrong'
  });
  results.push(invalidLogin);
  console.log(`   ${invalidLogin.success ? '❌' : '✅'} POST /auth/login (invalid) - Should fail: ${!invalidLogin.success ? 'Passed' : 'Failed'}\n`);
  
  // 7. Test Get All Users
  console.log('7️⃣ Testing Get Users...');
  const users = await testEndpoint('/users', 'GET');
  results.push(users);
  console.log(`   ${users.success ? '✅' : '❌'} GET /users - ${users.success ? `Found ${users.data?.length || 0} users` : users.message}\n`);
  
  // 8. Test Get User by ID
  if (testUserId) {
    console.log('8️⃣ Testing Get User by ID...');
    const user = await testEndpoint(`/users/${testUserId}`, 'GET');
    results.push(user);
    console.log(`   ${user.success ? '✅' : '❌'} GET /users/:id - ${user.success ? `Found ${user.data?.username}` : user.message}\n`);
    
    // 9. Test Update User Balance
    console.log('9️⃣ Testing Update User Balance...');
    const updateBalance = await testEndpoint(`/users/${testUserId}/balance`, 'PATCH', { amount: 50 });
    results.push(updateBalance);
    console.log(`   ${updateBalance.success ? '✅' : '❌'} PATCH /users/:id/balance - ${updateBalance.success ? `New balance: ${updateBalance.data?.balance}` : updateBalance.message}\n`);
    
    // 10. Test Update User Points
    console.log('🔟 Testing Update User Points...');
    const updatePoints = await testEndpoint(`/users/${testUserId}/points`, 'PATCH', { amount: 100 });
    results.push(updatePoints);
    console.log(`   ${updatePoints.success ? '✅' : '❌'} PATCH /users/:id/points - ${updatePoints.success ? `New points: ${updatePoints.data?.points}` : updatePoints.message}\n`);
  }
  
  // 11. Test Get Leagues
  console.log('1️⃣1️⃣ Testing Get Leagues...');
  const leagues = await testEndpoint('/leagues', 'GET');
  results.push(leagues);
  console.log(`   ${leagues.success ? '✅' : '❌'} GET /leagues - ${leagues.success ? `Found ${leagues.data?.length || 0} leagues` : leagues.message}`);
  
  if (leagues.success && leagues.data && leagues.data.length > 0) {
    const firstLeague = leagues.data[0];
    const league = await testEndpoint(`/leagues/${firstLeague.id}`, 'GET');
    results.push(league);
    console.log(`   ${league.success ? '✅' : '❌'} GET /leagues/:id - ${league.success ? `Found ${league.data?.name}` : league.message}\n`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(1)}%\n`);
  
  if (failed > 0) {
    console.log('Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  ❌ ${r.method} ${r.endpoint}: ${r.message}`);
    });
  }
  
  console.log('\n✨ Tests completed!\n');
}

// Run tests
runTests().catch(console.error);
