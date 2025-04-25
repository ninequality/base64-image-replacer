import React, { useState } from 'react';

function App() {
  const [convertedHtml, setConvertedHtml] = useState('');

  const handleFileChange = async (e) => {
    const htmlFile = e.target.files[0];
    if (!htmlFile) return;

    const htmlText = await htmlFile.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const imgTags = doc.querySelectorAll('img');

    for (let img of imgTags) {
      const src = img.getAttribute('src');
      if (!src) continue;

      try {
        const imageResponse = await fetch(src);
        const blob = await imageResponse.blob();
        const base64 = await convertBlobToBase64(blob);
        img.setAttribute('src', base64);
      } catch (error) {
        console.error(`이미지를 불러올 수 없습니다: ${src}`, error);
      }
    }

    setConvertedHtml('<!DOCTYPE html>\n' + doc.documentElement.outerHTML);
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Base64 이미지 변환기</h2>
      <input type="file" accept=".html" onChange={handleFileChange} />
      {convertedHtml && (
        <div>
          <h3>변환된 HTML</h3>
          <textarea value={convertedHtml} rows={20} cols={80} readOnly />
        </div>
      )}
    </div>
  );
}

export default App;
