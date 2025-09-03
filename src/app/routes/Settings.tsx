import React from 'react'
import { useGameStore } from '../../state/gameStore'

interface SettingsProps {
  onClose: () => void
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings, updateSettings } = useGameStore()

  const handleVolumeChange = (type: 'music' | 'sfx', value: number) => {
    updateSettings({ [`${type}Volume`]: value / 100 })
  }

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] })
  }

  return (
    <div className="menu-overlay">
      <div className="settings-panel">
        <div className="menu-title">SETTINGS</div>
        
        <div className="settings-section">
          <div className="settings-title">AUDIO</div>
          
          <div className="setting-row">
            <span className="setting-label">Music Volume</span>
            <div className="setting-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.musicVolume * 100}
                onChange={(e) => handleVolumeChange('music', Number(e.target.value))}
                className="slider"
              />
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
          </div>
          
          <div className="setting-row">
            <span className="setting-label">SFX Volume</span>
            <div className="setting-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sfxVolume * 100}
                onChange={(e) => handleVolumeChange('sfx', Number(e.target.value))}
                className="slider"
              />
              <span>{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
          </div>
          
          <div className="setting-row">
            <span className="setting-label">Mute All</span>
            <div className="setting-control">
              <input
                type="checkbox"
                checked={settings.mute}
                onChange={() => handleToggle('mute')}
                className="checkbox"
              />
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <div className="settings-title">VISUAL</div>
          
          <div className="setting-row">
            <span className="setting-label">CRT Effect</span>
            <div className="setting-control">
              <input
                type="checkbox"
                checked={settings.crtEffect}
                onChange={() => handleToggle('crtEffect')}
                className="checkbox"
              />
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <div className="settings-title">GAMEPLAY</div>
          
          <div className="setting-row">
            <span className="setting-label">Authentic Quirks</span>
            <div className="setting-control">
              <input
                type="checkbox"
                checked={settings.authenticQuirks}
                onChange={() => handleToggle('authenticQuirks')}
                className="checkbox"
              />
            </div>
          </div>
          
          <div className="setting-row">
            <span className="setting-label">Coyote Time</span>
            <div className="setting-control">
              <input
                type="checkbox"
                checked={settings.coyoteTime}
                onChange={() => handleToggle('coyoteTime')}
                className="checkbox"
              />
            </div>
          </div>
          
          <div className="setting-row">
            <span className="setting-label">Jump Buffer</span>
            <div className="setting-control">
              <input
                type="checkbox"
                checked={settings.jumpBuffer}
                onChange={() => handleToggle('jumpBuffer')}
                className="checkbox"
              />
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="menu-button primary" onClick={onClose}>
            BACK
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
