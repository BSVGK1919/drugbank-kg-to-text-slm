import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getMyGenerations,
  deleteGeneration,
  exportGenerations,
  downloadSavedGenerationFile
} from '../services/api';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

import {
  FileText,
  Database,
  AlignLeft,
  History,
  Trash2,
  Copy,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';

import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../components/ui/alert-dialog';

const DashboardPage = () => {
  const { user } = useAuth();

  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [downloadMenuId, setDownloadMenuId] = useState(null);

  const saveBlobResponse = (response, fallbackName) => {
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    const disposition = response.headers['content-disposition'];
    let filename = fallbackName;

    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match) {
        filename = match[1];
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  const formatDateTime = (value) => {
    if (!value) return 'No activity';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'No activity';
    return date.toLocaleString();
  };

  const countTriples = (text) => {
    if (!text || typeof text !== 'string') return 0;
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0).length;
  };

  const countWords = (text) => {
    if (!text || typeof text !== 'string') return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  };

  const fetchGenerations = useCallback(async () => {
    try {
      const data = await getMyGenerations();
      setGenerations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenerations();

    const handleGenerationSaved = () => {
      fetchGenerations();
    };

    window.addEventListener('generation-saved', handleGenerationSaved);

    return () => {
      window.removeEventListener('generation-saved', handleGenerationSaved);
    };
  }, [fetchGenerations]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteGeneration(deleteId);
      setGenerations((prev) => prev.filter((g) => g.id !== deleteId));

      if (expandedId === deleteId) {
        setExpandedId(null);
      }

      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleteId(null);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleDownloadSaved = async (generationId, format) => {
    try {
      const response = await downloadSavedGenerationFile(generationId, format);
      saveBlobResponse(response, `generation.${format}`);
      toast.success(`Downloaded as ${format.toUpperCase()}`);
      setDownloadMenuId(null);
    } catch {
      toast.error('Download failed');
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportGenerations();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'biokg-export.json';
      a.click();

      URL.revokeObjectURL(url);
      toast.success('Exported');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleMergeAll = () => {
    if (!generations.length) {
      toast.error('No generations available');
      return;
    }

    let merged = '';

    generations.forEach((g, i) => {
      merged += `Generation ${i + 1}\n`;
      merged += `Created: ${formatDateTime(g.created_at)}\n`;
      merged += `--------------------------------\n`;
      merged += `${g.generated_text}\n\n\n`;
    });

    const blob = new Blob([merged], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `merged-generations-${Date.now()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
    toast.success('Merged file downloaded');
  };

  const filtered = generations.filter(
    (g) =>
      g.input_triples?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.generated_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGenerations = generations.length;

  const totalTriplesProcessed = generations.reduce(
    (sum, g) => sum + countTriples(g.input_triples),
    0
  );

  const averageOutputLength =
    generations.length > 0
      ? Math.round(
          generations.reduce((sum, g) => sum + countWords(g.generated_text), 0) /
            generations.length
        )
      : 0;

  const lastActivity =
    generations.length > 0
      ? formatDateTime(
          [...generations]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]?.created_at
        )
      : 'No activity';

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-app">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-neutral-400">
              Your research library and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: FileText,
                value: totalGenerations,
                label: 'Total Generations',
                color: 'violet'
              },
              {
                icon: Database,
                value: totalTriplesProcessed,
                label: 'Total Triples Processed',
                color: 'emerald'
              },
              {
                icon: AlignLeft,
                value: `${averageOutputLength} words`,
                label: 'Average Output Length',
                color: 'blue'
              },
              {
                icon: History,
                value: lastActivity,
                label: 'Last Activity',
                color: 'amber'
              }
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-${stat.color}-900/30 border border-${stat.color}-500/30 flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-black text-white break-words">{stat.value}</p>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mb-4 gap-3 flex-wrap">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />

            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={handleMergeAll}>
                <FileText className="w-4 h-4 mr-2" />
                Merge All
              </Button>

              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-violet-500" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 border border-neutral-800">
                <p className="text-white font-semibold mb-2">No saved generations</p>
                <p className="text-neutral-500 text-sm">
                  Generate and save to build your library
                </p>
              </div>
            ) : (
              filtered.map((gen) => (
                <div key={gen.id} className="border border-neutral-800 p-4">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs text-neutral-500">
                          Generated: {formatDateTime(gen.created_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                        <div className="px-3 py-2 border border-neutral-800 bg-neutral-950">
                          <p className="text-[11px] text-neutral-500 mb-1">Triples</p>
                          <p className="text-sm font-semibold text-white">
                            {countTriples(gen.input_triples)}
                          </p>
                        </div>

                        <div className="px-3 py-2 border border-neutral-800 bg-neutral-950">
                          <p className="text-[11px] text-neutral-500 mb-1">Output Length</p>
                          <p className="text-sm font-semibold text-white">
                            {countWords(gen.generated_text)} words
                          </p>
                        </div>

                        <div className="px-3 py-2 border border-neutral-800 bg-neutral-950">
                          <p className="text-[11px] text-neutral-500 mb-1">Latency</p>
                          <p className="text-sm font-semibold text-white">
                            {gen.latency_ms} ms
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-300 font-mono truncate">
                        {gen.input_triples}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="ghost"
                        onClick={() => handleCopy(gen.generated_text)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>

                      <div className="relative">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setDownloadMenuId(
                              downloadMenuId === gen.id ? null : gen.id
                            )
                          }
                        >
                          <Download className="w-4 h-4" />
                        </Button>

                        {downloadMenuId === gen.id && (
                          <div className="absolute right-0 top-10 bg-neutral-900 border border-neutral-700 z-20 min-w-[180px]">
                            {['csv', 'rdf', 'ttl', 'pdf', 'jsonl'].map((fmt) => (
                              <button
                                key={fmt}
                                onClick={() => handleDownloadSaved(gen.id, fmt)}
                                className="block px-4 py-2 text-sm hover:bg-neutral-800 w-full text-left text-neutral-300"
                              >
                                Download {fmt.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        onClick={() => setDeleteId(gen.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() =>
                          setExpandedId(expandedId === gen.id ? null : gen.id)
                        }
                      >
                        {expandedId === gen.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {expandedId === gen.id && (
                    <div className="mt-4 border-t border-neutral-800 pt-4">
                      <div className="mb-3">
                        <p className="text-xs text-neutral-500 mb-2">INPUT</p>
                        <pre className="text-sm bg-neutral-950 p-3 font-mono text-neutral-300 whitespace-pre-wrap border border-neutral-800">
                          {gen.input_triples}
                        </pre>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-500 mb-2">OUTPUT</p>
                        <p className="text-neutral-300 whitespace-pre-wrap">
                          {gen.generated_text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPage;