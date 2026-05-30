import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateText, saveGeneration, downloadGenerationFile } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Copy,
  Download,
  Trash2,
  Clock,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
  Upload,
  FileText,
  X,
  ChevronRight
}
from 'lucide-react';
import { toast } from 'sonner';

const DemoPage = () => {
  const { isAuthenticated } = useAuth();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latency, setLatency] = useState(null);
  const [saved, setSaved] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleDownloadCurrentGeneration = async (format) => {
    try {
      if (!input || !output) {
        toast.error('Nothing to download');
        return;
      }

      const response = await downloadGenerationFile({
        input_triples: input,
        generated_text: output,
        latency_ms: latency,
        format
      });

      saveBlobResponse(response, `generation.${format}`);
      toast.success(`Downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please provide knowledge graph triples');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');
    setLatency(null);
    setSaved(false);

    try {
      const result = await generateText(input);
      setOutput(result.generated_text);
      setLatency(result.latency_ms);
      toast.success('Generation complete');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Generation failed';
      setError(errorMessage);
      toast.error('Generation failed', { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

const handleSaveGeneration = async () => {
  if (!isAuthenticated) {
    toast.error('Sign in to save generations');
    return;
  }

  try {
    await saveGeneration({
      input_triples: input,
      generated_text: output,
      latency_ms: latency
    });

    window.dispatchEvent(new Event('generation-saved'));
    toast.success('Saved to library');

    setSaved(false);
    setInput('');
    setOutput('');
    setError('');
    setLatency(null);
    setUploadedFile(null);
  } catch (err) {
    toast.error('Failed to save');
  }
};

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setLatency(null);
    setSaved(false);
    setUploadedFile(null);
  };

  const parseFileContent = async (file) => {
    const text = await file.text();
    const extension = file.name.split('.').pop().toLowerCase();

    try {
      if (extension === 'json') {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          return data.map((item) => {
            if (typeof item === 'string') return item;
            if (item.subject && item.predicate && item.object) {
              return `${item.subject} | ${item.predicate} | ${item.object}`;
            }
            return JSON.stringify(item);
          }).join('\n');
        }
        return JSON.stringify(data, null, 2);
      } else if (extension === 'csv') {
        const lines = text.trim().split('\n');
        return lines.map((line) => line.replace(/,/g, ' | ')).join('\n');
      } else if (extension === 'ttl' || extension === 'nt' || extension === 'rdf') {
        const lines = text.trim().split('\n').filter((l) => !l.startsWith('@') && !l.startsWith('#') && l.trim());
        return lines.join('\n');
      }
      return text;
    } catch {
      return text;
    }
  };

  const handleFileUpload = async (file) => {
    const allowedExtensions = ['csv', 'json', 'ttl', 'nt', 'rdf', 'txt'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      toast.error('Unsupported format');
      return;
    }

    try {
      const content = await parseFileContent(file);
      setInput(content);
      setUploadedFile(file);
      toast.success(`Loaded ${file.name}`);
    } catch {
      toast.error('Failed to parse file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="min-h-screen bg-black" data-testid="demo-page">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-app">
          <div className="mb-12 fade-up">
            <p className="section-overline">KNOWLEDGE GRAPH TRANSFORMATION</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Generate Clinical Text
            </h1>
            <p className="text-neutral-400 max-w-2xl">
              Transform pharmaceutical knowledge graph triples into publication-ready
              natural language for research and clinical documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-6 fade-up delay-100">
              <div className="card-dark p-6" data-testid="input-panel">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Input Knowledge Graph</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="text-neutral-400 hover:text-white"
                    data-testid="clear-btn"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>

                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-neutral-800 rounded-none">
                    <TabsTrigger value="text" className="text-sm font-semibold rounded-none data-[state=active]:bg-violet-600">
                      <FileText className="w-4 h-4 mr-2" />
                      Text Input
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="text-sm font-semibold rounded-none data-[state=active]:bg-violet-600">
                      <Upload className="w-4 h-4 mr-2" />
                      File Upload
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter KG triples here..."
                      className="textarea-dark min-h-[200px]"
                      data-testid="triples-input"
                  />
                  </TabsContent>

                  <TabsContent value="upload">
                    <div
                      className={`upload-zone-dark ${dragOver ? 'dragover' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="upload-kg-dropzone"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".csv,.json,.ttl,.nt,.rdf,.txt"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                      />
                      <Upload className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-white mb-2">
                        Drop your knowledge graph file here
                      </p>
                      <p className="text-sm text-neutral-500 mb-6">
                        or click to browse
                      </p>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {['CSV', 'JSON', 'TTL', 'RDF', 'TXT'].map((fmt) => (
                          <span key={fmt} className="px-3 py-1 bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-400">
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </div>

                    {uploadedFile && (
                      <div className="mt-4 p-3 bg-violet-900/30 border border-violet-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-violet-400" />
                          <span className="text-sm font-medium text-white">{uploadedFile.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedFile(null);
                            setInput('');
                          }}
                          className="p-1 hover:bg-neutral-800"
                        >
                          <X className="w-4 h-4 text-neutral-400" />
                        </button>
                      </div>
                    )}

                    {input && (
                      <div className="mt-4">
                        <p className="text-xs font-bold tracking-wider text-neutral-500 mb-2">PARSED CONTENT</p>
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="textarea-dark min-h-[150px]"
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-800">
                  <span className="text-sm text-neutral-500">
                    {input.length} characters
                  </span>
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !input.trim()}
                    className="btn-primary"
                    data-testid="generate-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Generate
                        <ChevronRight className="w-5 h-5 ml-1 text-violet-300" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="card-dark" data-testid="output-panel">
                <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white">Generated Output</h2>
                    {latency && (
                      <span className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 font-mono">
                        <Clock className="w-3 h-3" />
                        {latency}ms
                      </span>
                    )}
                  </div>

                  {output && (
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="text-neutral-400 hover:text-white"
                        data-testid="copy-output-btn"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>

                      {isAuthenticated && !saved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveGeneration}
                          className="text-violet-400 hover:text-violet-300"
                          data-testid="save-generation-btn"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      )}

                      {saved && (
                        <span className="flex items-center gap-1 text-sm text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          Saved
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="min-h-[200px] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-white font-semibold">Synthesizing clinical text...</p>
                      <p className="text-sm text-neutral-500 mt-1">Analyzing knowledge graph relationships</p>
                    </div>
                  ) : error ? (
                    <div className="min-h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 border border-red-500/30 bg-red-900/20 flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <p className="text-red-400 font-semibold mb-2">Processing Error</p>
                        <p className="text-sm text-neutral-500 max-w-md">{error}</p>
                      </div>
                    </div>
                  ) : output ? (
                    <>
                      <div className="output-container min-h-[200px]">
                        <p className="output-text whitespace-pre-wrap" data-testid="generated-text">
                          {output}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {['csv', 'rdf', 'ttl', 'pdf', 'jsonl'].map((fmt) => (
                          <Button
                            key={fmt}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadCurrentGeneration(fmt)}
                            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download {fmt.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="min-h-[200px] flex items-center justify-center border border-dashed border-neutral-700">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 border border-neutral-700 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-neutral-600" />
                        </div>
                        <p className="text-neutral-400 font-semibold">Output will appear here</p>
                        <p className="text-sm text-neutral-600 mt-1">Provide knowledge graph triples to generate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoPage;