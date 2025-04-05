"use client";

import React, { useEffect, useRef } from 'react';

export default function SkillChart({ userData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!userData || !canvasRef.current) return;

    const canvas = canvasRef.current;
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
    const radius = Math.min(centerX, centerY) - 20;
    const angleStep = (Math.PI * 2) / skills.length;

    // 軸を描画
    ctx.strokeStyle = '#e2e8f0';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    
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
      
      // ラベル
      const labelX = centerX + (radius + 15) * Math.cos(angle);
      const labelY = centerY + (radius + 15) * Math.sin(angle);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.label, labelX, labelY);
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
    
  }, [userData]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={400} 
      className="w-full max-w-md mx-auto my-4"
    />
  );
} 