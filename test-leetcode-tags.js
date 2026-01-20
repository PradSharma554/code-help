const query = `
  query QuestionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      topicTags {
        name
      }
    }
  }
`;

async function testLeetCodeTags() {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        query,
        variables: { titleSlug: "two-sum" },
      }),
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testLeetCodeTags();
