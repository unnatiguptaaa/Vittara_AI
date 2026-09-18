import React, { useState, useRef } from 'react';
import { FileText, Upload, CheckCircle2, AlertCircle, FileCheck, Sparkles, ArrowRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { apiService } from '../api/client';
import { useJourney } from '../context/JourneyContext';
import { useLanguage } from '../context/LanguageContext';

export default function DocumentPage() {
  const { language, t } = useLanguage();
  const { updateJourney } = useJourney();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Check type
    const isPdf = selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf');
    const isTxt = selected.type === 'text/plain' || selected.name.toLowerCase().endsWith('.txt');

    if (!isPdf && !isTxt) {
      setError('Supported formats: PDF, TXT.');
      setFile(null);
      return;
    }

    // Check size <= 5MB
    if (selected.size > 5 * 1024 * 1024) {
      setError('Please upload a smaller document.');
      setFile(null);
      return;
    }

    setError(null);
    setFile(selected);
  };

  const handleUploadAndAnalyze = async (fileToAnalyze = null) => {
    const targetFile = fileToAnalyze || file;
    if (!targetFile) {
      setError('Please select a document to upload.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('document', targetFile);
    formData.append('language', language);

    try {
      const res = await apiService.analyzeDocument(formData);
      const data = res.data?.data;
      setAnalysisResult(data);

      updateJourney({
        lastAnalyzedDocument: {
          filename: data.filename,
          charCount: data.charCount,
          dateAnalyzed: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Document analysis error:', err);
      setError(err.response?.data?.error || 'An error occurred while analyzing the document.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/sample-loan-doc.txt');
      const text = await response.text();
      const sampleBlob = new Blob([text], { type: 'text/plain' });
      const sampleFile = new File([sampleBlob], 'SBI-Sanction-Letter-Demo.txt', { type: 'text/plain' });
      setFile(sampleFile);
      await handleUploadAndAnalyze(sampleFile);
    } catch (err) {
      setError('Could not load sample document.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-500/40">
          Document Intelligence & Strict Extraction
        </span>
        <h1 className="text-3xl font-black text-ivory tracking-tight mt-2 flex items-center gap-2">
          <FileText className="w-8 h-8 text-emerald-400" />
          {t.nav.documents}
        </h1>
        <p className="text-sm text-ivory-subtle mt-1 max-w-2xl">
          Upload loan sanction letters, policy schedules, or bank agreements (PDF, TXT). Vittara AI extracts text and uses Google Gemini to audit key financial figures and terms with strict rules: missing fields are explicitly flagged as <em>"Not found in document."</em>
        </p>
      </div>

      {/* Upload Box Card */}
      <Card className="p-8 border-slate-700 text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.txt,application/pdf,text/plain"
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-2xl p-8 cursor-pointer transition-all bg-midnight-950/60 hover:bg-midnight-900/80 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-ivory">
            {file ? file.name : 'Click to Browse or Drag Document Here'}
          </h3>
          <p className="text-xs text-ivory-subtle mt-1">
            Supported formats: <strong className="text-emerald-300">PDF, TXT</strong> • Maximum file size: <strong className="text-emerald-300">5MB</strong>
          </p>

          {file && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <FileCheck className="w-3.5 h-3.5" />
              <span>{(file.size / 1024).toFixed(1)} KB ready for audit</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => handleUploadAndAnalyze()}
            disabled={!file || isLoading}
            isLoading={isLoading}
            icon={Sparkles}
          >
            {t.actions.upload}
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={handleLoadSample}
            disabled={isLoading}
          >
            Load Demo Sanction Letter (.TXT)
          </Button>
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <ErrorState
          title="Document Upload Notice"
          message={error}
          onRetry={file ? () => handleUploadAndAnalyze() : null}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <LoadingState message="Extracting text and running Gemini structured audit..." />
      )}

      {/* Analysis Result Display */}
      {analysisResult && !isLoading && (
        <Card className="p-6 md:p-8 border-slate-700 space-y-6 animate-fadeIn">
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/40">
                Audited Document Result
              </span>
              <h3 className="text-xl font-black text-ivory mt-1">
                {analysisResult.filename}
              </h3>
              <p className="text-xs text-ivory-subtle mt-0.5">
                Format: <strong className="text-emerald-300">{analysisResult.fileType}</strong> • Extracted: <strong className="text-emerald-300">{analysisResult.wordCount} words</strong> ({analysisResult.charCount} characters)
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-midnight-950/70 border border-slate-700 text-xs text-ivory-subtle">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auditor: {analysisResult.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Strict Local Auditor'}</span>
            </div>
          </div>

          {/* Structured Analysis Content */}
          <div className="max-w-none text-sm leading-relaxed text-slate-300 bg-midnight-950/70 p-6 rounded-2xl border border-slate-700 whitespace-pre-line font-sans">
            {analysisResult.analysis}
          </div>

          {/* Raw Text Preview Accordion */}
          {analysisResult.extractedTextPreview && (
            <details className="text-xs border-t border-slate-700/80 pt-4">
              <summary className="cursor-pointer text-ivory-subtle hover:text-ivory font-semibold select-none">
                View Extracted Text Feed ({analysisResult.charCount} characters)
              </summary>
              <pre className="mt-3 p-4 rounded-xl bg-midnight-950/70 border border-slate-700 text-[11px] text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto max-h-48">
                {analysisResult.extractedTextPreview}
              </pre>
            </details>
          )}
        </Card>
      )}
    </div>
  );
}
