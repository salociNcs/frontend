export default async function handler(req, res) {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        {
          hello
        }
      `,
    }),
  });
  const data = await response.json();
  res.status(200).json(data);
}
