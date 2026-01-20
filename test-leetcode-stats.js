const { getUserStats } = require("./lib/leetcode");

async function test() {
  console.log("Fetching stats for 'tmwilliamlin168'...");
  const stats = await getUserStats("tmwilliamlin168");
  console.log("Stats:", JSON.stringify(stats, null, 2));
}

test();
