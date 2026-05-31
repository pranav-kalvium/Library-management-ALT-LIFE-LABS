const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY || 'libmgmt-secret-key-2024';

const headers = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
};

export async function fetchPendingIssuances() {
  const res = await fetch(`${BASE_URL}/issuance/pending/today`, {
    headers: { 'x-api-key': API_KEY },
  });
  if (!res.ok) throw new Error('Failed to fetch pending issuances');
  return res.json();
}

export async function fetchAllBooks() {
  const res = await fetch(`${BASE_URL}/book`, {
    headers: { 'x-api-key': API_KEY },
  });
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function fetchAllMembers() {
  const res = await fetch(`${BASE_URL}/member`, {
    headers: { 'x-api-key': API_KEY },
  });
  if (!res.ok) throw new Error('Failed to fetch members');
  return res.json();
}
