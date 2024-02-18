'use client'

import { useState } from 'react'

export function PdfUpload() {
  const [file, setFile] = useState<File>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous error message

    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('application/pdf')) {
      setErrorMessage('Only PDF files are allowed.');
      return;
    }

    // Check file size
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

      // handle the error
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      console.error(e);
      setErrorMessage('An error occurred during upload.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        name="file"
        accept='.pdf'
        onChange={(e) => setFile(e.target.files?.[0])}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input type="submit" value="Upload" />
    </form>
  );
}
