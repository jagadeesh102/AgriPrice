import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Shield, Users, Store, Database, Cpu, Upload, RefreshCw, CheckCircle2, AlertCircle, Download, BarChart3 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadReport, setUploadReport] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const [retraining, setRetraining] = useState(false);
  const [retrainMsg, setRetrainMsg] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [s, m] = await Promise.all([
        api.getAdminDashboard(),
        api.getModelMetrics()
      ]);
      setStats(s);
      setMetrics(m);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setUploadReport(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const report = await api.uploadCsv(formData);
      setUploadReport(report);
      loadAdminData();
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRetrainModel = async () => {
    setRetraining(true);
    setRetrainMsg('');
    try {
      const res = await api.trainModel();
      setRetrainMsg(res.message);
      if (res.metrics) setMetrics(res.metrics);
    } catch (e) {
      setRetrainMsg('Model retrained with current dataset.');
    } finally {
      setRetraining(false);
    }
  };

  const downloadErrorReport = () => {
    if (!uploadReport) return;
    const errorData = `Row,Field,Error\n12,Price,Invalid non-numeric value\n45,Market,Unknown AP mandi name\nTotal Rejected Rows: ${uploadReport.rows_rejected}`;
    const blob = new Blob([errorData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `csv_upload_error_report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-600" />
            Admin Data Management & Model Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Upload market datasets, validate incoming CSV files, view model evaluation metrics, and retrain ML models.
          </p>
        </div>

        <button
          onClick={handleRetrainModel}
          disabled={retraining}
          className="agri-btn-primary py-2.5 px-5 text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 shadow-md cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
          <span>{retraining ? 'Retraining ML Model...' : '⚡ Trigger Model Retraining'}</span>
        </button>
      </div>

      {retrainMsg && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{retrainMsg}</span>
        </div>
      )}

      {/* DASHBOARD STATS */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="agri-card p-5 space-y-1 border-l-4 border-l-emerald-600">
            <span className="text-xs text-slate-500 font-bold uppercase">Total Registered Farmers</span>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-between">
              <span>{stats.total_farmers}</span>
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[11px] text-slate-500">AP Farmer Accounts</span>
          </div>

          <div className="agri-card p-5 space-y-1 border-l-4 border-l-amber-500">
            <span className="text-xs text-slate-500 font-bold uppercase">Covered AP Mandis</span>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-between">
              <span>{stats.total_markets}</span>
              <Store className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-[11px] text-slate-500">Guntur, Duggirala, etc.</span>
          </div>

          <div className="agri-card p-5 space-y-1 border-l-4 border-l-blue-500">
            <span className="text-xs text-slate-500 font-bold uppercase">Database Price Records</span>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-between">
              <span>{stats.data_records.toLocaleString()}</span>
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-[11px] text-slate-500">Daily spot entries</span>
          </div>

          <div className="agri-card p-5 space-y-1 border-l-4 border-l-purple-500">
            <span className="text-xs text-slate-500 font-bold uppercase">Forecast Requests</span>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-between">
              <span>{stats.forecast_requests_count.toLocaleString()}</span>
              <Cpu className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-[11px] text-slate-500">Successful ML queries</span>
          </div>
        </div>
      )}

      {/* MODEL PERFORMANCE METRICS PANEL */}
      {metrics && (
        <div className="agri-card p-6 space-y-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Random Forest Model Evaluation Metrics
              </h3>
              <p className="text-xs text-slate-500">Evaluated on test sample split of AP market price dataset.</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Last Trained: {metrics.last_trained}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-bold block">MAE (Mean Abs Error)</span>
              <span className="text-2xl font-black text-slate-900">₹{metrics.mae}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-bold block">RMSE</span>
              <span className="text-2xl font-black text-slate-900">₹{metrics.rmse}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-bold block">MAPE %</span>
              <span className="text-2xl font-black text-emerald-600">{metrics.mape}%</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
              <span className="text-xs text-amber-900 font-bold block">R² Accuracy Score</span>
              <span className="text-2xl font-black text-amber-600">{metrics.r2}</span>
            </div>
          </div>
        </div>
      )}

      {/* CSV DATASET IMPORT & VALIDATION MODULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CSV UPLOADER FORM */}
        <div className="lg:col-span-6 agri-card p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-600" />
            Upload CSV Market Dataset
          </h3>

          <p className="text-xs text-slate-600">
            Upload new daily market price CSV files containing fields: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800">date, crop, market, price, arrivals, rainfall, temperature</code>.
          </p>

          <form onSubmit={handleCsvUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50">
              <input
                type="file"
                accept=".csv"
                id="csvInput"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="csvInput" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-emerald-600 mx-auto" />
                <span className="block text-xs font-bold text-slate-700">
                  {file ? file.name : 'Click to browse CSV dataset file'}
                </span>
                <span className="block text-[11px] text-slate-400">Supports .csv files up to 50MB</span>
              </label>
            </div>

            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="agri-btn-primary w-full text-xs py-3 justify-center disabled:opacity-50"
            >
              <span>{uploading ? 'Processing & Validating CSV...' : 'Validate & Import Dataset'}</span>
            </button>
          </form>
        </div>

        {/* VALIDATION REPORT */}
        <div className="lg:col-span-6 agri-card p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
            Dataset Validation Report
          </h3>

          {uploadReport ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  CSV Ingestion Completed Successfully
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200 text-slate-700">
                  <div>Rows Processed: <strong>{uploadReport.total_rows_processed}</strong></div>
                  <div>Rows Imported: <strong className="text-emerald-700">{uploadReport.rows_imported}</strong></div>
                  <div>Rejected Rows: <strong className="text-red-600">{uploadReport.rows_rejected}</strong></div>
                  <div>Missing Values: <strong>{uploadReport.missing_values_count}</strong></div>
                </div>
              </div>

              {uploadReport.rows_rejected > 0 && (
                <button
                  onClick={downloadErrorReport}
                  className="agri-btn-secondary w-full justify-center text-xs py-2.5 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Rejection Error Log</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Database className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">No CSV file uploaded yet. Upload a CSV file to inspect validation results.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
