"use client";

import React, { useState, useEffect } from 'react';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RefreshCw, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ProfileEditor({ userData, userId, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    technical_skill: 0,
    problem_solving_ability: 0,
    communication_skill: 0,
    leadership_and_collaboration: 0,
    frontend_skill: 0,
    backend_skill: 0,
    infrastructure_skill: 0,
    security_awareness: 0,
    image: ''
  });
  
  // 変更があったかどうかを追跡する状態
  const [hasChanges, setHasChanges] = useState(false);
  // カスタムメッセージ用の状態
  const [customMessage, setCustomMessage] = useState(null);
  
  const { updateUser, loading, error, success } = useUpdateUser();

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        technical_skill: userData.technical_skill || 0,
        problem_solving_ability: userData.problem_solving_ability || 0,
        communication_skill: userData.communication_skill || 0,
        leadership_and_collaboration: userData.leadership_and_collaboration || 0,
        frontend_skill: userData.frontend_skill || 0,
        backend_skill: userData.backend_skill || 0,
        infrastructure_skill: userData.infrastructure_skill || 0,
        security_awareness: userData.security_awareness || 0,
        image: userData.image || ''
      });
      setHasChanges(false); // 初期化時は変更なし
    }
  }, [userData]);

  // 元のデータと現在のフォームデータを比較して変更があるか確認
  const checkForChanges = (currentData) => {
    if (!userData) return false;
    
    // 比較対象のフィールド
    const fieldsToCompare = [
      'name',
      'technical_skill',
      'problem_solving_ability',
      'communication_skill',
      'leadership_and_collaboration',
      'frontend_skill',
      'backend_skill',
      'infrastructure_skill',
      'security_awareness',
      'image'
    ];
    
    // 特殊なケース：画像がnullの場合と空文字列の場合は同等とみなす
    const normalizeImageValue = (val) => {
      if (val === null || val === '') return '';
      return val;
    };
    
    return fieldsToCompare.some(field => {
      if (field === 'image') {
        return normalizeImageValue(currentData[field]) !== normalizeImageValue(userData[field]);
      }
      return currentData[field] !== userData[field];
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    setHasChanges(checkForChanges(newFormData));
  };

  const handleSliderChange = (name, value) => {
    const newFormData = {
      ...formData,
      [name]: value[0]
    };
    setFormData(newFormData);
    setHasChanges(checkForChanges(newFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCustomMessage(null);
    
    // 変更がない場合は早期リターン
    if (!hasChanges) {
      setCustomMessage({
        type: 'info',
        text: '変更はありません。'
      });
      return;
    }
    
    const submitData = {
      ...formData,
      name: formData.name.trim() || userData.name
    };
    
    // imageフィールドが空文字列の場合はnullに設定
    if (submitData.image === '') {
      submitData.image = null;
    }
    
    console.log('送信データ:', submitData); // デバッグ用
    
    const result = await updateUser(userId, submitData);
    if (result && onUpdate) {
      onUpdate(result);
      setHasChanges(false); // 更新後は変更なしに戻す
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="名前を入力"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">プロフィール画像URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              placeholder="画像URLを入力 (空白でリセット)"
            />
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="プレビュー" 
                  className="h-20 w-20 object-cover rounded-full"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">スキル設定</h3>
        <div className="space-y-4">
          <SkillSlider 
            name="technical_skill" 
            label="技術力" 
            value={formData.technical_skill} 
            onChange={handleSliderChange} 
          />
          <SkillSlider 
            name="problem_solving_ability" 
            label="問題解決力" 
            value={formData.problem_solving_ability} 
            onChange={handleSliderChange} 
          />
          <SkillSlider 
            name="communication_skill" 
            label="コミュニケーション" 
            value={formData.communication_skill} 
            onChange={handleSliderChange} 
          />
          <SkillSlider 
            name="leadership_and_collaboration" 
            label="リーダーシップ" 
            value={formData.leadership_and_collaboration} 
            onChange={handleSliderChange} 
          />
          <SkillSlider 
            name="frontend_skill" 
            label="フロントエンド" 
            value={formData.frontend_skill} 
            onChange={handleSliderChange} 
          />
          <SkillSlider 
            name="backend_skill" 
            label="バックエンド" 
            value={formData.backend_skill} 
            onChange={handleSliderChange} 
          />
          <SkillSlider 
            name="infrastructure_skill" 
            label="インフラ" 
            value={formData.infrastructure_skill} 
            onChange={handleSliderChange} 
          />
          <SkillSlider 
            name="security_awareness" 
            label="セキュリティ" 
            value={formData.security_awareness} 
            onChange={handleSliderChange} 
          />
        </div>
      </div>
      
      {error && (
        <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="flex items-center p-3 text-sm text-green-600 bg-green-50 rounded-md">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          プロフィールを更新しました
        </div>
      )}
      
      {customMessage && (
        <div className={`flex items-center p-3 text-sm rounded-md ${
          customMessage.type === 'info' 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-yellow-600 bg-yellow-50'
        }`}>
          <Info className="w-4 h-4 mr-2" />
          {customMessage.text}
        </div>
      )}
      
      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={loading || (!hasChanges && !customMessage)}
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            更新中...
          </>
        ) : hasChanges ? '変更を保存' : '変更なし'}
      </Button>
    </form>
  );
}

// スキルスライダーコンポーネント
function SkillSlider({ name, label, value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={name}>{label}</Label>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <Slider
        id={name}
        name={name}
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={(val) => onChange(name, val)}
      />
    </div>
  );
} 