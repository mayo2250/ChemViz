import React from 'react';
import { UploadCloud, FileCheck, Loader2 } from 'lucide-react';

const UploadZone = ({ onFileSelect, fileName, isUploading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <label className={`
        flex flex-col items-center justify-center w-full h-52 
        border-2 border-dashed rounded-2xl cursor-pointer 
        transition-all duration-300 ease-in-out
        ${fileName 
          ? 'border-green-500/50 bg-green-500/5' 
          : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'
        }
      `}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-3" />
          ) : fileName ? (
             <FileCheck className="w-12 h-12 text-green-500 mb-3" />
          ) : (
             <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
          )}
          
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            {fileName ? (
              <span className="font-semibold text-green-600 dark:text-green-400">{fileName}</span>
            ) : (
              <span><span className="font-semibold">Click to upload</span> or drag and drop</span>
            )}
          </p>
          <p className="text-xs text-slate-400">CSV files only (Max 10MB)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".csv" 
          onChange={onFileSelect} 
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default UploadZone;