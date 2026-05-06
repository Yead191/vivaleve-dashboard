import { useState } from 'react';
import { App, Button, Input, Modal, Form, Select, Table } from 'antd';
import { Plus, Download, Upload, Trash2, Globe } from 'lucide-react';
import { localizationStrings, locales as initLocales } from '../../data/mockData';
import { ColumnsType } from 'antd/es/table';

const localeLabels: Record<string, string> = {
  en: '🇬🇧 English', es: '🇪🇸 Español', fr: '🇫🇷 Français', ja: '🇯🇵 日本語',
  de: '🇩🇪 Deutsch', it: '🇮🇹 Italiano', pt: '🇵🇹 Português', bn: '🇧🇩 বাংলা',
};

export default function LocalizationTab() {
  const { message, modal } = App.useApp();
  const [strings, setStrings] = useState<any[]>(localizationStrings);
  const [locales, setLocales] = useState<string[]>(initLocales);
  const [addStringOpen, setAddStringOpen] = useState(false);
  const [addLocaleOpen, setAddLocaleOpen] = useState(false);
  const [stringForm] = Form.useForm();
  const [localeForm] = Form.useForm();

  const updateCell = (id: string, locale: string, value: string) => {
    setStrings(ss => ss.map(s => s.id === id ? { ...s, [locale]: value } : s));
  };

  const cols: ColumnsType<any> = [
    {
      title: 'Key', dataIndex: 'key', key: 'key', width: 200, fixed: 'left',
      render: v => <code className="text-[12px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">{v}</code>
    },
    ...locales.map(loc => ({
      title: <span className="text-[12px] font-medium">{localeLabels[loc] || loc.toUpperCase()}</span>,
      dataIndex: loc, key: loc,
      render: (v: any, r: any) => (
        <Input
          variant="borderless"
          value={v || ''}
          placeholder={v ? '' : 'Missing'}
          onChange={(e) => updateCell(r.id, loc, e.target.value)}
          className={`!text-[12px] ${!v ? '!bg-amber-50' : ''}`}
        />
      ),
    })),
    {
      title: '', key: 'a', width: 60, fixed: 'right', align: 'right',
      render: (_, r) => (
        <Button size="small" type="text" danger icon={<Trash2 className="w-3.5 h-3.5" />}
          onClick={() => modal.confirm({
            title: `Delete "${r.key}"?`,
            content: 'This permanently removes this string and its translations.',
            okText: 'Delete', okButtonProps: { danger: true },
            onOk: () => { setStrings(ss => ss.filter(x => x.id !== r.id)); message.success('String deleted'); },
          })}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold text-gray-900">Localization strings</h3>
          <p className="text-[12px] text-gray-500">Edit translations inline. Cells highlighted in amber are missing translations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={<Download className="w-4 h-4" />} onClick={() => message.success('Exported strings.json')}>Export JSON</Button>
          <Button icon={<Upload className="w-4 h-4" />} onClick={() => message.success('Import flow opened')}>Import JSON</Button>
          <Button icon={<Globe className="w-4 h-4" />} onClick={() => { localeForm.resetFields(); setAddLocaleOpen(true); }}>Add locale</Button>
          <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { stringForm.resetFields(); setAddStringOpen(true); }}>Add string</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table
          dataSource={strings}
          columns={cols}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 200 + locales.length * 220 + 60 }}
        />
      </div>

      {/* Add string modal */}
      <Modal
        open={addStringOpen}
        title="Add new string key"
        okText="Add string"
        onOk={() => stringForm.validateFields().then(values => {
          setStrings(ss => [{ id: `ls_${Date.now()}`, ...values }, ...ss]);
          setAddStringOpen(false);
          message.success('String added');
        })}
        onCancel={() => setAddStringOpen(false)}
        centered
        width={560}
      >
        <Form form={stringForm} layout="vertical">
          <Form.Item name="key" label="String key" rules={[{ required: true, pattern: /^[a-z0-9._]+$/, message: 'Lowercase, dots and underscores only' }]}>
            <Input placeholder="e.g. profile.edit.title" />
          </Form.Item>
          {locales.map(loc => (
            <Form.Item
              key={loc} name={loc}
              label={`Value · ${localeLabels[loc] || loc.toUpperCase()}`}
              rules={loc === 'en' ? [{ required: true, message: 'English value is required' }] : []}
            >
              <Input placeholder={`Translation in ${loc.toUpperCase()}`} />
            </Form.Item>
          ))}
        </Form>
      </Modal>

      {/* Add locale modal */}
      <Modal
        open={addLocaleOpen}
        title="Add new locale"
        okText="Add locale"
        onOk={() => localeForm.validateFields().then(values => {
          if (locales.includes(values.code)) {
            message.warning('Locale already exists');
            return;
          }
          setLocales(ls => [...ls, values.code]);
          setAddLocaleOpen(false);
          message.success(`Locale "${values.code}" added`);
        })}
        onCancel={() => setAddLocaleOpen(false)}
        destroyOnClose
      >
        <Form form={localeForm} layout="vertical">
          <Form.Item name="code" label="Locale code" rules={[{ required: true, pattern: /^[a-z]{2}(-[A-Z]{2})?$/, message: 'Use ISO codes like "de" or "pt-BR"' }]}>
            <Select
              showSearch
              placeholder="Pick a locale code"
              options={[
                { value: 'de', label: '🇩🇪 de · German' },
                { value: 'it', label: '🇮🇹 it · Italian' },
                { value: 'pt', label: '🇵🇹 pt · Portuguese' },
                { value: 'pt-BR', label: '🇧🇷 pt-BR · Brazilian Portuguese' },
                { value: 'bn', label: '🇧🇩 bn · Bengali' },
                { value: 'hi', label: '🇮🇳 hi · Hindi' },
                { value: 'ar', label: '🇸🇦 ar · Arabic' },
                { value: 'ko', label: '🇰🇷 ko · Korean' },
                { value: 'zh', label: '🇨🇳 zh · Chinese' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
