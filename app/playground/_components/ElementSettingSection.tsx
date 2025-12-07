import React, { useState, useEffect } from 'react'
import { MousePointer, Type, Palette, Ruler, ChevronDown, ChevronUp, Save, Check } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { SelectedElement } from '../[projectId]/page'

interface Props {
  selectedElement: SelectedElement | null
  onUpdateStyle: (property: string, value: string) => void
  onUpdateText: (text: string) => void
  onSaveChanges?: () => void
}

const ElementSettingSection = ({ selectedElement, onUpdateStyle, onUpdateText, onSaveChanges }: Props) => {
  const [expandedSections, setExpandedSections] = useState({
    text: true,
    colors: true,
    typography: true,
    spacing: false
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Reset unsaved changes when a different element is selected (not when properties change)
  useEffect(() => {
    setHasUnsavedChanges(false)
    setSaveSuccess(false)
  }, [selectedElement?.xpath])

  // Helper to send updates to parent
  const sendStyleUpdate = (property: string, value: string) => {
    console.log('🎨 Style update:', property, '=', value);
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
    onUpdateStyle(property, value);
  };

  const sendTextUpdate = (text: string) => {
    console.log('📝 Text update:', text);
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
    onUpdateText(text);
  };

  const handleSaveChanges = async () => {
    if (!onSaveChanges) return;

    setIsSaving(true);
    try {
      await onSaveChanges();
      setHasUnsavedChanges(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('💾 hasUnsavedChanges:', hasUnsavedChanges);
  }, [hasUnsavedChanges]);

  if (!selectedElement) {
    return (
      <div className='w-80 bg-white border-l border-slate-200 p-6 flex items-center justify-center h-full'>
        <div className='text-center'>
          <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center'>
            <MousePointer className='w-8 h-8 text-slate-400' />
          </div>
          <h3 className='text-sm font-semibold text-slate-700 mb-2'>No Element Selected</h3>
          <p className='text-xs text-slate-500'>
            Enable Edit Mode and click any element to customize its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-80 bg-white border-l border-slate-200 overflow-y-auto h-full'>
      {/* Header */}
      <div className='p-4 border-b border-slate-200 sticky top-0 bg-white z-10'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-sm font-semibold text-slate-800'>Element Settings</h3>
          <span className='text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono'>
            {selectedElement.tagName.toLowerCase()}
          </span>
        </div>
        {selectedElement.classList.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {selectedElement.classList.map((cls, i) => (
              <span key={i} className='text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono'>
                .{cls}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Text Content Section */}
      <div className='border-b border-slate-200'>
        <button
          onClick={() => toggleSection('text')}
          className='w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors'
        >
          <div className='flex items-center gap-2'>
            <Type className='w-4 h-4 text-slate-600' />
            <span className='text-sm font-medium text-slate-700'>Text Content</span>
          </div>
          {expandedSections.text ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
        </button>
        {expandedSections.text && (
          <div className='p-4 pt-0'>
            <textarea
              value={selectedElement.textContent}
              onChange={(e) => sendTextUpdate(e.target.value)}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500'
              rows={4}
              placeholder='Enter text content...'
            />
          </div>
        )}
      </div>

      {/* Colors Section */}
      <div className='border-b border-slate-200'>
        <button
          onClick={() => toggleSection('colors')}
          className='w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors'
        >
          <div className='flex items-center gap-2'>
            <Palette className='w-4 h-4 text-slate-600' />
            <span className='text-sm font-medium text-slate-700'>Colors</span>
          </div>
          {expandedSections.colors ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
        </button>
        {expandedSections.colors && (
          <div className='p-4 pt-0 space-y-4'>
            <div>
              <label className='block text-xs font-medium text-slate-600 mb-2'>Text Color</label>
              <div className='flex items-center gap-3'>
                <div className='flex-1'>
                  <HexColorPicker
                    color={selectedElement.styles.color}
                    onChange={(color) => sendStyleUpdate('color', color)}
                    style={{ width: '100%', height: '120px' }}
                  />
                </div>
              </div>
              <div className='mt-2 flex items-center gap-2'>
                <div
                  className='w-8 h-8 rounded border-2 border-slate-300'
                  style={{ backgroundColor: selectedElement.styles.color }}
                />
                <input
                  type='text'
                  value={selectedElement.styles.color}
                  onChange={(e) => sendStyleUpdate('color', e.target.value)}
                  className='flex-1 px-2 py-1 border border-slate-300 rounded text-xs font-mono'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-medium text-slate-600 mb-2'>Background Color</label>
              <div className='flex items-center gap-3'>
                <div className='flex-1'>
                  <HexColorPicker
                    color={selectedElement.styles.backgroundColor}
                    onChange={(color) => sendStyleUpdate('backgroundColor', color)}
                    style={{ width: '100%', height: '120px' }}
                  />
                </div>
              </div>
              <div className='mt-2 flex items-center gap-2'>
                <div
                  className='w-8 h-8 rounded border-2 border-slate-300'
                  style={{ backgroundColor: selectedElement.styles.backgroundColor }}
                />
                <input
                  type='text'
                  value={selectedElement.styles.backgroundColor}
                  onChange={(e) => sendStyleUpdate('backgroundColor', e.target.value)}
                  className='flex-1 px-2 py-1 border border-slate-300 rounded text-xs font-mono'
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Typography Section */}
      <div className='border-b border-slate-200'>
        <button
          onClick={() => toggleSection('typography')}
          className='w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors'
        >
          <div className='flex items-center gap-2'>
            <Type className='w-4 h-4 text-slate-600' />
            <span className='text-sm font-medium text-slate-700'>Typography</span>
          </div>
          {expandedSections.typography ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
        </button>
        {expandedSections.typography && (
          <div className='p-4 pt-0 space-y-4'>
            <div>
              <label className='block text-xs font-medium text-slate-600 mb-2'>
                Font Size: {selectedElement.styles.fontSize}
              </label>
              <input
                type='range'
                min='8'
                max='72'
                value={parseInt(selectedElement.styles.fontSize)}
                onChange={(e) => sendStyleUpdate('fontSize', e.target.value + 'px')}
                className='w-full accent-purple-500'
              />
              <div className='flex justify-between text-xs text-slate-500 mt-1'>
                <span>8px</span>
                <span>72px</span>
              </div>
            </div>

            <div>
              <label className='block text-xs font-medium text-slate-600 mb-2'>Font Weight</label>
              <select
                value={selectedElement.styles.fontWeight}
                onChange={(e) => sendStyleUpdate('fontWeight', e.target.value)}
                className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
              >
                <option value='100'>Thin (100)</option>
                <option value='200'>Extra Light (200)</option>
                <option value='300'>Light (300)</option>
                <option value='400'>Normal (400)</option>
                <option value='500'>Medium (500)</option>
                <option value='600'>Semibold (600)</option>
                <option value='700'>Bold (700)</option>
                <option value='800'>Extra Bold (800)</option>
                <option value='900'>Black (900)</option>
              </select>
            </div>

            <div>
              <label className='block text-xs font-medium text-slate-600 mb-2'>Text Align</label>
              <div className='grid grid-cols-4 gap-2'>
                {['left', 'center', 'right', 'justify'].map((align) => (
                  <button
                    key={align}
                    onClick={() => sendStyleUpdate('textAlign', align)}
                    className={`px-2 py-1.5 text-xs rounded border transition-colors ${selectedElement.styles.textAlign === align
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-purple-300'
                      }`}
                  >
                    {align[0].toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacing Section */}
      <div className='border-b border-slate-200'>
        <button
          onClick={() => toggleSection('spacing')}
          className='w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors'
        >
          <div className='flex items-center gap-2'>
            <Ruler className='w-4 h-4 text-slate-600' />
            <span className='text-sm font-medium text-slate-700'>Spacing</span>
          </div>
          {expandedSections.spacing ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
        </button>
        {expandedSections.spacing && (
          <div className='p-4 pt-0 space-y-4'>
            <div>
              <label className='block text-xs font-medium text-slate-600 mb-2'>
                Padding: {selectedElement.styles.padding}
              </label>
              <input
                type='text'
                value={selectedElement.styles.padding}
                onChange={(e) => sendStyleUpdate('padding', e.target.value)}
                placeholder='e.g., 10px or 10px 20px'
                className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>

            <div>
              <label className='block text-xs font-medium text-slate-600 mb-2'>
                Margin: {selectedElement.styles.margin}
              </label>
              <input
                type='text'
                value={selectedElement.styles.margin}
                onChange={(e) => sendStyleUpdate('margin', e.target.value)}
                placeholder='e.g., 10px or 10px 20px'
                className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Changes Button - Always visible at bottom */}
      <div className='sticky bottom-0 p-4 bg-white border-t-2 border-slate-200 shadow-lg'>
        <button
          onClick={handleSaveChanges}
          disabled={!hasUnsavedChanges || isSaving || saveSuccess}
          className={`w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${saveSuccess
            ? 'bg-green-500 text-white'
            : isSaving
              ? 'bg-purple-400 text-white cursor-wait'
              : hasUnsavedChanges
                ? 'bg-purple-500 text-white hover:bg-purple-600 active:scale-95'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
        >
          {saveSuccess ? (
            <>
              <Check className='w-4 h-4' />
              Changes Saved!
            </>
          ) : isSaving ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              Saving...
            </>
          ) : (
            <>
              <Save className='w-4 h-4' />
              {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ElementSettingSection
