import React, { useState, useEffect } from 'react';

const ImageDiagnostic: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  
  const addResult = (result: string) => {
    setResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
    console.log(result);
  };
  
  useEffect(() => {
    const runDiagnostics = async () => {
      addResult('Starting image diagnostics...');
      
      // Test URL
      const testUrl = 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_33PM.jpeg';
      
      // Test 1: Basic image loading
      const img1 = new Image();
      img1.onload = () => {
        addResult(`✅ Basic image load successful: ${img1.naturalWidth}x${img1.naturalHeight}`);
      };
      img1.onerror = () => {
        addResult('❌ Basic image load failed');
      };
      img1.src = testUrl;
      
      // Test 2: Fetch API
      try {
        const response = await fetch(testUrl, { method: 'HEAD' });
        addResult(`✅ Fetch API: ${response.status} ${response.statusText}`);
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        addResult(`Headers: ${JSON.stringify(headers, null, 2)}`);
      } catch (err) {
        addResult(`❌ Fetch API failed: ${err}`);
      }
      
      // Test 3: Check for Content Security Policy
      const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (meta) {
        addResult(`⚠️ CSP found: ${meta.getAttribute('content')}`);
      } else {
        addResult('✅ No CSP meta tag found');
      }
      
      // Test 4: Check if running in a special environment
      addResult(`User Agent: ${navigator.userAgent}`);
      addResult(`Protocol: ${window.location.protocol}`);
      addResult(`Hostname: ${window.location.hostname}`);
      
      // Test 5: Try creating an img element in DOM
      const testImg = document.createElement('img');
      testImg.style.width = '100px';
      testImg.style.height = '100px';
      testImg.style.border = '2px solid red';
      testImg.onload = () => {
        addResult('✅ DOM img element loaded');
      };
      testImg.onerror = () => {
        addResult('❌ DOM img element failed');
      };
      testImg.src = testUrl;
      document.body.appendChild(testImg);
      
      // Remove after 5 seconds
      setTimeout(() => {
        document.body.removeChild(testImg);
      }, 5000);
    };
    
    runDiagnostics();
  }, []);
  
  return (
    <div className="fixed bottom-20 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">Image Diagnostics</h3>
      <div className="text-xs font-mono space-y-1">
        {results.map((result, index) => (
          <div key={index} className={result.includes('✅') ? 'text-green-600' : result.includes('❌') ? 'text-red-600' : 'text-gray-600'}>
            {result}
          </div>
        ))}
      </div>
      <button 
        onClick={() => setResults([])}
        className="mt-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
      >
        Clear
      </button>
    </div>
  );
};

export default ImageDiagnostic;