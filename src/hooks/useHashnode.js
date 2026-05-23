import { useState, useEffect } from 'react';

const HASHNODE_GQL = 'https://gql.hashnode.com';

export function useHashnode(username, limit = 6) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheKey = `hashnode_${username}_${limit}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // 10 minute cache TTL
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        setPosts(data);
        setLoading(false);
        return;
      }
    }

    const query = `
      query GetUserPosts($username: String!) {
        user(username: $username) {
          posts(page: 1, pageSize: ${limit}) {
            nodes {
              id
              title
              brief
              slug
              coverImage { url }
              publishedAt
              readTimeInMinutes
              tags { name }
              url
            }
          }
        }
      }
    `;

    fetch(HASHNODE_GQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } })
    })
      .then(r => r.json())
      .then(data => {
        const fetchedPosts = data?.data?.user?.posts?.nodes || [];
        setPosts(fetchedPosts);
        setLoading(false);
        localStorage.setItem(cacheKey, JSON.stringify({
          data: fetchedPosts,
          timestamp: Date.now()
        }));
      })
      .catch(err => { setError(err); setLoading(false); });
  }, [username, limit]);

  return { posts, loading, error };
}
