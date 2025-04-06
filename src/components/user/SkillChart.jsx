"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function SkillChart({ userData }) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });

  // キャンバスサイズを調整するための関数
  const adjustCanvasSize = () => {
    if (!canvasRef.current) return;
    const container = canvasRef.current.parentElement;
    const containerWidth = container.clientWidth;
    // モバイルデバイスでは小さめに
    const size = Math.min(containerWidth - 20, 500);
    setCanvasSize({ width: size, height: size });
  };

  // 初回レンダリング時とウィンドウリサイズ時にキャンバスサイズを調整
  useEffect(() => {
    adjustCanvasSize();
    window.addEventListener('resize', adjustCanvasSize);
    return () => window.removeEventListener('resize', adjustCanvasSize);
  }, []);

  // テキストを改行する関数
  const wrapText = (text, maxLength = 5) => {
    if (text.length <= maxLength) return [text];
    
    const lines = [];
    for (let i = 0; i < text.length; i += maxLength) {
      lines.push(text.substring(i, i + maxLength));
    }
    return lines;
  };

  useEffect(() => {
    if (!userData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');
    
    // キャンバスのクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // スキル項目の定義
    const skills = [
      { key: 'technical_skill', label: '技術力' },
      { key: 'problem_solving_ability', label: '問題解決力' },
      { key: 'communication_skill', label: 'コミュニケーション' },
      { key: 'leadership_and_collaboration', label: 'リーダーシップ' },
      { key: 'frontend_skill', label: 'フロントエンド' },
      { key: 'backend_skill', label: 'バックエンド' },
      { key: 'infrastructure_skill', label: 'インフラ' },
      { key: 'security_awareness', label: 'セキュリティ' }
    ];

    // チャートの設定
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // 余白を増やしてラベルのはみ出しを防止
    const margin = Math.min(centerX, centerY) * 0.3;
    const radius = Math.min(centerX, centerY) - margin;
    const angleStep = (Math.PI * 2) / skills.length;

    // 軸を描画
    ctx.strokeStyle = '#e2e8f0';
    ctx.fillStyle = '#64748b';
    
    // フォントサイズをキャンバスサイズに応じて調整
    const fontSize = Math.max(10, Math.floor(radius * 0.08));
    ctx.font = `${fontSize}px sans-serif`;
    
    // 背景の同心円を描画
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 各軸を描画
    skills.forEach((skill, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // 軸の線
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // ラベルの位置計算を改善
      let labelBaseX = centerX + (radius + fontSize) * Math.cos(angle);
      let labelBaseY = centerY + (radius + fontSize) * Math.sin(angle);
      
      // テキスト配置を角度に基づいて調整
      let textAlign = 'center';
      let xOffset = 0;
      
      if (angle < -Math.PI * 0.75 || angle > Math.PI * 0.75) {
        // 左側
        textAlign = 'right';
        xOffset = -5;
      } else if (angle > -Math.PI * 0.25 && angle < Math.PI * 0.25) {
        // 右側
        textAlign = 'left';
        xOffset = 5;
      }
      ctx.textAlign = textAlign;
      
      // ラベルテキストを改行する
      const textLines = wrapText(skill.label);
      const lineHeight = fontSize * 1.2;
      
      // 改行したテキストを描画
      textLines.forEach((line, lineIndex) => {
        // 上下の位置調整
        let yOffset = 0;
        if (angle > 0) {
          // 下半分
          ctx.textBaseline = 'top';
          yOffset = 5 + lineIndex * lineHeight;
        } else {
          // 上半分
          ctx.textBaseline = 'bottom';
          yOffset = -5 - (textLines.length - 1 - lineIndex) * lineHeight;
        }
        
        ctx.fillText(line, labelBaseX + xOffset, labelBaseY + yOffset);
      });
    });
    
    // データポイントを描画
    ctx.beginPath();
    skills.forEach((skill, i) => {
      const value = userData[skill.key] || 0;
      const normalizedValue = value / 100; // 0〜100の範囲を想定
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * normalizedValue * Math.cos(angle);
      const y = centerY + radius * normalizedValue * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgb(59, 130, 246)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // データポイントにマーカーを描画
    skills.forEach((skill, i) => {
      const value = userData[skill.key] || 0;
      const normalizedValue = value / 100; // 0〜100の範囲を想定
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * normalizedValue * Math.cos(angle);
      const y = centerY + radius * normalizedValue * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(59, 130, 246)';
      ctx.fill();
    });
    
  }, [userData, canvasSize]);

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <canvas 
        ref={canvasRef} 
        width={canvasSize.width} 
        height={canvasSize.height} 
        className="w-full h-auto"
      />
    </div>
  );
} 