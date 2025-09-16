import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const TestResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [urlInfo, setUrlInfo] = useState({});

  useEffect(() => {
    // Capturar todas as informações da URL
    const info = {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      href: window.location.href,
      searchParams: {},
      hashParams: {}
    };

    // Capturar search params
    for (const [key, value] of searchParams.entries()) {
      info.searchParams[key] = value;
    }

    // Capturar hash params
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      for (const [key, value] of hashParams.entries()) {
        info.hashParams[key] = value;
      }
    }

    setUrlInfo(info);
    console.log('URL Info:', info);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Debug - Reset Password URL</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">URL Completa:</h2>
            <p className="text-white font-mono text-sm break-all">{urlInfo.href}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">Pathname:</h2>
            <p className="text-white font-mono">{urlInfo.pathname}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">Search (Query String):</h2>
            <p className="text-white font-mono">{urlInfo.search || 'Nenhum'}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">Hash:</h2>
            <p className="text-white font-mono">{urlInfo.hash || 'Nenhum'}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">Search Params:</h2>
            <pre className="text-white font-mono text-sm bg-black/20 p-3 rounded">
              {JSON.stringify(urlInfo.searchParams, null, 2)}
            </pre>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">Hash Params:</h2>
            <pre className="text-white font-mono text-sm bg-black/20 p-3 rounded">
              {JSON.stringify(urlInfo.hashParams, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="mt-8">
          <a 
            href="/login" 
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Voltar ao Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestResetPassword;