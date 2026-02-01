import React from 'react';
import { BookOpen } from 'lucide-react';


function VocabAdminPage() {
  // Simple password protection for admin page
  const [unlocked, setUnlocked] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [pwError, setPwError] = React.useState('');
  // IMPORTANT: Set your admin password in .env as VITE_ADMIN_PASSWORD
  // For Vite/React, use import.meta.env
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';
  const [filterAttr, setFilterAttr] = React.useState('word');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [vocab, setVocab] = React.useState(null);
  const [editVocab, setEditVocab] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [level, setLevel] = React.useState(null);
  const [searchId, setSearchId] = React.useState("");
  const [searchIdLoading, setSearchIdLoading] = React.useState(false);
  // Search vocab by ID
  const handleSearchById = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    setSearchIdLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/vocabulary/by-id?id=${encodeURIComponent(searchId)}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Vocab not found');
      const data = await res.json();
      setVocab(data);
      setEditVocab(data);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
      setVocab(null);
      setEditVocab(null);
    } finally {
      setSearchIdLoading(false);
    }
  };

  const vocabAttributes = [
    { key: 'id', label: 'ID' },
    { key: 'word', label: 'Word' },
    { key: 'meaning', label: 'Meaning' },
    { key: 'furigana', label: 'Furigana' },
    { key: 'romaji', label: 'Romaji' },
    { key: 'level', label: 'Level' },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Created At' },
  ];

  // Fetch vocab when filter changes or on submit
  const fetchVocab = async (cursor, customLevel) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        attr: filterAttr,
        order: sortOrder,
      });
      const useLevel = customLevel !== undefined ? customLevel : level;
      if (useLevel !== null && useLevel !== undefined) {
        params.append('level', useLevel);
      }
      if (cursor !== undefined) {
        params.append('cursor', cursor);
      }
      const res = await fetch(`http://localhost:3000/vocabulary/admin-one?${params}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch vocab');
      const data = await res.json();
      setVocab(data);
      setEditVocab(data);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
      setVocab(null);
    } finally {
      setLoading(false);
    }
  };


  // Only fetch on button click for more control


  // Submit button logic: fetch first vocab in order
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchVocab(undefined, undefined);
  };

  // Next button logic: fetch next vocab in order
  const handleNext = () => {
    if (!vocab) return;
    const cursorValue = vocab[filterAttr];
    fetchVocab(cursorValue, undefined);
  };

  // Previous button logic: fetch previous vocab in order
  const handlePrevious = () => {
    if (!vocab) return;
    const prevOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const cursorValue = vocab[filterAttr];
    // Fetch previous vocab by using reverse order and current cursor
    const params = new URLSearchParams({
      attr: filterAttr,
      order: prevOrder,
    });
    if (level !== null && level !== undefined) {
      params.append('level', level);
    }
    if (cursorValue !== undefined) {
      params.append('cursor', cursorValue);
    }
    setLoading(true);
    setError('');
    fetch(`http://localhost:3000/vocabulary/admin-one?${params}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch vocab');
        return res.json();
      })
      .then(data => {
        setVocab(data);
        setEditVocab(data);
        setEditMode(false);
      })
      .catch(err => {
        setError(err.message);
        setVocab(null);
      })
      .finally(() => setLoading(false));
  };

  // Handle edit field change
  const handleEditChange = (key, value) => {
    setEditVocab((prev) => ({ ...prev, [key]: value }));
    setEditMode(true);
  };

  // Save/submit edited vocab to backend
  const handleSave = async () => {
    if (!editVocab || !editVocab.id) return;
    setSaveLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3000/vocabulary/admin-one`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editVocab),
      });
      if (!res.ok) throw new Error('Failed to update vocab');
      const data = await res.json();
      setVocab(data);
      setEditVocab(data);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Level button logic: fetch first vocab for selected level
  const handleLevel = (lv) => {
    setLevel(lv);
    fetchVocab(undefined, lv);
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Admin Access Required</h2>
          <input
            type="password"
            className="border border-indigo-300 rounded px-3 py-2 mb-3 w-full"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleUnlock(); }}
            autoFocus
          />
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition w-full"
            onClick={handleUnlock}
          >Unlock</button>
          {pwError && <div className="text-red-500 mt-2">{pwError}</div>}
        </div>
      </div>
    );
  }

  function handleUnlock() {
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setPwError('');
    } else {
      setPwError('Incorrect password');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        {/* Search by ID */}
        <form className="flex justify-center gap-2 mb-6" onSubmit={handleSearchById}>
          <input
            type="text"
            className="border border-indigo-300 rounded px-3 py-2 w-64"
            placeholder="Search vocab by ID (UUID)"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            disabled={searchIdLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
            disabled={searchIdLoading || !searchId}
          >{searchIdLoading ? 'Searching...' : 'Search'}</button>
        </form>
        {/* Level Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {[0, 1, 2, 3, 4, 5].map(lv => (
            <button
              key={lv}
              className={`px-4 py-2 rounded-lg font-semibold shadow border border-indigo-300 ${level === lv ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'} hover:bg-indigo-200 transition`}
              onClick={() => handleLevel(lv)}
            >Level {lv}</button>
          ))}
        </div>
        {/* Filter Box */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="filter-attr" className="text-indigo-700 font-semibold mr-2">Order by:</label>
            <select
              id="filter-attr"
              value={filterAttr}
              onChange={e => setFilterAttr(e.target.value)}
              className="border border-indigo-300 rounded px-2 py-1 text-indigo-700 bg-indigo-50"
            >
              {vocabAttributes.map(attr => (
                <option key={attr.key} value={attr.key}>{attr.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-700 font-semibold">Order:</span>
            <button
              className={`px-3 py-1 rounded font-semibold shadow border border-indigo-300 ${sortOrder === 'asc' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-indigo-400'}`}
              onClick={() => setSortOrder('asc')}
            >Asc</button>
            <button
              className={`px-3 py-1 rounded font-semibold shadow border border-indigo-300 ${sortOrder === 'desc' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-indigo-400'}`}
              onClick={() => setSortOrder('desc')}
            >Desc</button>
          </div>
        </div>
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="w-10 h-10 text-indigo-600 mr-3" />
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">Vocab Admin</h1>
        </div>
        <div className="mb-6 text-center text-indigo-500 font-medium">
          Manage and review vocabularies from your database
        </div>

        {/* Vocabulary Table Schema Card */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-indigo-500" /> Vocabulary Table Schema
            </h2>
            <table className="w-full text-left">
              <thead>
                <tr className="text-indigo-600">
                  <th className="py-2 px-3">Attribute</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="text-indigo-900">
                <tr><td className="py-2 px-3 font-semibold">id</td><td className="py-2 px-3">String (UUID)</td><td className="py-2 px-3">Primary key</td></tr>
                <tr><td className="py-2 px-3 font-semibold">word</td><td className="py-2 px-3">String</td><td className="py-2 px-3">Vocabulary word</td></tr>
                <tr><td className="py-2 px-3 font-semibold">meaning</td><td className="py-2 px-3">String</td><td className="py-2 px-3">English meaning</td></tr>
                <tr><td className="py-2 px-3 font-semibold">furigana</td><td className="py-2 px-3">String?</td><td className="py-2 px-3">Kana reading (optional)</td></tr>
                <tr><td className="py-2 px-3 font-semibold">romaji</td><td className="py-2 px-3">String?</td><td className="py-2 px-3">Romaji reading (optional)</td></tr>
                <tr><td className="py-2 px-3 font-semibold">level</td><td className="py-2 px-3">Int</td><td className="py-2 px-3">JLPT level</td></tr>
                <tr><td className="py-2 px-3 font-semibold">description</td><td className="py-2 px-3">String?</td><td className="py-2 px-3">Vocab description (optional)</td></tr>
                <tr><td className="py-2 px-3 font-semibold">createdAt</td><td className="py-2 px-3">DateTime</td><td className="py-2 px-3">Creation timestamp</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <form className="flex justify-center gap-6 mt-4 mb-10" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
            disabled={loading}
          >Submit</button>
          <button
            type="button"
            className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold shadow hover:bg-indigo-200 transition"
            onClick={handlePrevious}
            disabled={loading || !vocab}
          >Previous</button>
          <button
            type="button"
            className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold shadow hover:bg-indigo-200 transition"
            onClick={handleNext}
            disabled={loading || !vocab}
          >Next</button>
        </form>

        {/* Vocab Data Display */}
        <div className="flex flex-col items-center justify-center min-h-[8rem] text-indigo-700">
          {loading && <span className="text-lg">Loading...</span>}
          {error && <span className="text-red-500">{error}</span>}
          {!loading && !error && editVocab && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg shadow p-6 w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4 text-indigo-700">Vocab Data</h3>
              <table className="w-full text-left">
                <tbody>
                  {vocabAttributes.map(attr => (
                    <tr key={attr.key}>
                      <td className="py-2 px-3 font-semibold text-indigo-600 w-1/3">{attr.label}</td>
                      <td className="py-2 px-3 text-indigo-900">
                        {attr.key === 'id' || attr.key === 'createdAt' ? (
                          editVocab[attr.key] !== undefined ? String(editVocab[attr.key]) : <span className="text-gray-400">-</span>
                        ) : (
                          <input
                            className="border border-indigo-200 rounded px-2 py-1 w-full bg-white"
                            value={editVocab[attr.key] !== undefined && editVocab[attr.key] !== null ? String(editVocab[attr.key]) : ''}
                            onChange={e => handleEditChange(attr.key, e.target.value)}
                            disabled={loading || saveLoading}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editMode && (
                <button
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
                  onClick={handleSave}
                  disabled={saveLoading}
                >{saveLoading ? 'Saving...' : 'Submit'}</button>
              )}
            </div>
          )}
          {!loading && !error && !editVocab && (
            <span className="text-indigo-400">No vocab found.</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default VocabAdminPage;
