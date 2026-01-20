const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";

const RECENT_SUBMISSIONS_QUERY = `
  query RecentSubmissions($username: String!) {
    recentSubmissionList(username: $username, limit: 15) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`;

const PROBLEM_TAGS_QUERY = `
  query QuestionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      topicTags {
        name
      }
    }
  }
`;

export async function getRecentSubmissions(username) {
  try {
    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query: RECENT_SUBMISSIONS_QUERY,
        variables: { username },
      }),
    });

    const data = await response.json();
    return data.data?.recentSubmissionList || [];
  } catch (error) {
    console.error("Error fetching LeetCode submissions:", error);
    return [];
  }
}

export async function getProblemTags(titleSlug) {
  try {
    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query: PROBLEM_TAGS_QUERY,
        variables: { titleSlug },
      }),
    });

    const data = await response.json();
    const tags = data.data?.question?.topicTags || [];
    return tags.map((t) => t.name).join(", ");
  } catch (error) {
    console.error("Error fetching problem tags:", error);
    return "Unknown";
  }
}
const USER_STATS_QUERY = `
  query UserProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }
`;

export async function getUserStats(username) {
  try {
    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query: USER_STATS_QUERY,
        variables: { username },
      }),
    });

    const data = await response.json();
    return data.data?.matchedUser?.submitStats?.acSubmissionNum || [];
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error);
    return [];
  }
}
