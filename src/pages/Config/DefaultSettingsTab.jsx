import { useState } from 'react';
import { App, Button, InputNumber, Select, Modal, Slider } from 'antd';
import { RotateCcw, Save } from 'lucide-react';
import SectionCard from '../../components/common/SectionCard.jsx';
import { defaultSettings } from '../../data/mockData.js';

export default function DefaultSettingsTab() {
  const { message, modal } = App.useApp();
  const [settings, setSettings] = useState(defaultSettings);
  const [dirty, setDirty]       = useState(false);

  const update = (k, v) => { setSettings(s => ({ ...s, [k]: v })); setDirty(true); };

  const save = () => {
    modal.confirm({
      title: 'Save default settings?',
      content: 'New users from this point will be onboarded with these defaults. Existing users are not affected.',
      okText: 'Save',
      onOk: () => { setDirty(false); message.success('Defaults saved'); },
    });
  };

  const reset = () => {
    modal.confirm({
      title: 'Reset to system defaults?',
      content: 'All values will be restored to the original ship defaults. Unsaved changes will be lost.',
      okText: 'Reset', okButtonProps: { danger: true },
      onOk: () => { setSettings(defaultSettings); setDirty(false); message.success('Reset to defaults'); },
    });
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Match & swipe defaults" description="Applied to all new accounts unless changed by the user.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Max swipes per day (free users)" hint="Premium users have unlimited swipes.">
            <InputNumber min={10} max={500} value={settings.maxSwipesPerDayFree} onChange={v => update('maxSwipesPerDayFree', v)} className="!w-full" />
          </Field>
          <Field label="Match radius default (km)">
            <InputNumber min={1} max={500} value={settings.matchRadiusKm} onChange={v => update('matchRadiusKm', v)} className="!w-full" />
          </Field>

          <Field label="Default age range">
            <div className="px-2">
              <Slider
                range min={18} max={80}
                value={[settings.ageRangeMin, settings.ageRangeMax]}
                onChange={([min, max]) => setSettings(s => ({ ...s, ageRangeMin: min, ageRangeMax: max })) || setDirty(true)}
              />
              <div className="text-[12px] text-gray-500 text-center mt-1">
                {settings.ageRangeMin} – {settings.ageRangeMax} years
              </div>
            </div>
          </Field>

          <Field label="Profile visibility">
            <Select
              value={settings.profileVisibility}
              onChange={v => update('profileVisibility', v)}
              options={[
                { value: 'public',         label: 'Public — anyone can find you' },
                { value: 'matches_only',   label: 'Matches only — hidden until matched' },
                { value: 'verified_only',  label: 'Verified users only' },
              ]}
              className="!w-full"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Profile & messaging defaults">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Max photos per profile">
            <InputNumber min={1} max={12} value={settings.maxPhotosPerProfile} onChange={v => update('maxPhotosPerProfile', v)} className="!w-full" />
          </Field>
          <Field label="Message character limit">
            <InputNumber min={100} max={5000} step={100} value={settings.messageCharLimit} onChange={v => update('messageCharLimit', v)} className="!w-full" />
          </Field>
        </div>
      </SectionCard>

      <div className="flex items-center justify-end gap-2 sticky bottom-0 bg-gray-50 py-3 -mx-6 px-6 border-t border-gray-200">
        <Button icon={<RotateCcw className="w-4 h-4" />} onClick={reset}>Reset to defaults</Button>
        <Button type="primary" icon={<Save className="w-4 h-4" />} onClick={save} disabled={!dirty}>
          Save settings
        </Button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-800 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
