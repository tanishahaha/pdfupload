'use client'

import { useState } from 'react'

export function PdfUpload() {
  const [file, setFile] = useState<File>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        setErrorMessage('File size exceeds the 20MB limit.');
      } else {
        setFile(selectedFile);
        setErrorMessage(null); 
      }
    } else {
      setFile(undefined);
      setErrorMessage(null); 
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null); 

    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    if (!file.type.startsWith('application/pdf')) {
      setErrorMessage('Only PDF files are allowed.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 20MB limit.');
      return;
    }

    try {
      const data = new FormData();
      data.set('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setSuccessMessage('File uploaded successfully!');
        setFile(undefined); 
      } else {
        throw new Error(await res.text());
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage('An error occurred during upload.');
    }
  };

  return (
    <form onSubmit={onSubmit} className='flex flex-col text-center justify-center items-center'>

<label
      htmlFor="uploadFile1"
      className="bg-white text-center rounded w-full sm:w-[360px] min-h-[160px] py-4 px-4 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 mx-auto font-[sans-serif] m-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 mb-6 fill-gray-400"
        viewBox="0 0 24 24"
      >
        <path
          d="M22 13a1 1 0 0 0-1 1v4.213A2.79 2.79 0 0 1 18.213 21H5.787A2.79 2.79 0 0 1 3 18.213V14a1 1 0 0 0-2 0v4.213A4.792 4.792 0 0 0 5.787 23h12.426A4.792 4.792 0 0 0 23 18.213V14a1 1 0 0 0-1-1Z"
          data-original="#000000"
        />
        <path
          d="M6.707 8.707 11 4.414V17a1 1 0 0 0 2 0V4.414l4.293 4.293a1 1 0 0 0 1.414-1.414l-6-6a1 1 0 0 0-1.414 0l-6 6a1 1 0 0 0 1.414 1.414Z"
          data-original="#000000"
        />
      </svg>
      <p className="text-gray-400 font-semibold text-sm">
        Drag & Drop or <span className="text-[#007bff]">Choose file</span> to
        upload
      </p>
      <input
        type="file"
        id="uploadFile1"
        name="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
      />
      <p className="text-xs text-gray-400 mt-2">Only PDF's are Allowed.</p>
    </label>
      
      

    {errorMessage && (
        <div className="bg-red-100 text-red-800 px-4 py-4 rounded m-4" role="alert">
          <strong className="font-bold text-base mr-4">Failed!</strong>
          <span className="block text-sm sm:inline max-sm:mt-1">{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!file || !!errorMessage}
        className="px-2 py-2.5 min-w-[140px] bg-gradient-to-r from-purple-400 rounded text-white text-sm tracking-wider font-medium border-none outline-none bg-purple-600 active:from-green-500"
      >
        {file && !errorMessage ? 'Upload' : 'Select a File'}
      </button>

      {successMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-4 rounded m-4" role="alert">
          <strong className="font-bold text-base mr-4">Success!</strong>
          <span className="block text-sm sm:inline max-sm:mt-1">{successMessage}</span>
        </div>
      )}
    </form>
  );
}
