export default async function Fetcher(...args) {
  const response = await fetch(...args);

  return response.json();
}
