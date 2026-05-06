import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { App, Button, Tag } from 'antd';
import {
  ArrowLeft, Edit3, Pause, Ban, Trash2, Plus, MapPin, Mail, Phone, Calendar, ShieldCheck,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import SectionCard from '../../components/common/SectionCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import UserCell from '../../components/common/UserCell.jsx';
import EditProfileModal from './EditProfileModal.jsx';
import AddNoteModal from './AddNoteModal.jsx';
import SuspendUserModal from './SuspendUserModal.jsx';
import BanUserModal from './BanUserModal.jsx';
import { users, reportsAgainstUsers } from '../../data/mockData.js';

const photoColors = ['from-rose-300 to-pink-400', 'from-amber-300 to-orange-400', 'from-emerald-300 to-teal-400', 'from-violet-300 to-purple-400'];

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();

  const user = useMemo(() => users.find(u => u.id === id) || users[0], [id]);

  const [editOpen,    setEditOpen]    = useState(false);
  const [noteOpen,    setNoteOpen]    = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [banOpen,     setBanOpen]     = useState(false);

  const [notes, setNotes] = useState([
    { id: 1, author: 'Aria Dey',   when: '2026-04-22', visibility: 'internal', body: 'User requested data export under GDPR. Verified identity via email magic link.' },
    { id: 2, author: 'Mod Team',   when: '2026-03-10', visibility: 'flagged',  body: 'Two reports closed as not actionable; reporter context was unclear.' },
  ]);

  const matchHistory = [
    { id: 'm1', other: 'Maya Chen',     when: '2026-04-30', messages: 24 },
    { id: 'm2', other: 'Liam Murphy',   when: '2026-04-22', messages: 8  },
    { id: 'm3', other: 'Aiko Tanaka',   when: '2026-04-19', messages: 0  },
    { id: 'm4', other: 'Noah Williams', when: '2026-04-12', messages: 41 },
  ];

  const reports = reportsAgainstUsers.filter(r => r.target === user.name).concat(reportsAgainstUsers.slice(0, 2));

  const accountTimeline = [
    { id: 't1', when: '2026-05-01', label: 'Status changed to active', type: 'status' },
    { id: 't2', when: '2026-04-30', label: 'Subscription upgraded to Premium', type: 'billing' },
    { id: 't3', when: '2026-04-12', label: 'Suspended 7d for harassment', type: 'mod' },
    { id: 't4', when: '2026-03-04', label: 'Phone number verified', type: 'verify' },
    { id: 't5', when: '2026-01-12', label: 'Account created', type: 'create' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button type="text" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/users')}>Back</Button>
      </div>

      <PageHeader
        breadcrumbs={['Users', user.name]}
        title={user.name}
        subtitle={`User ID · ${user.id}`}
        actions={
          <>
            <Button icon={<Edit3 className="w-4 h-4" />} onClick={() => setEditOpen(true)}>Edit profile</Button>
            <Button icon={<Pause className="w-4 h-4" />} onClick={() => setSuspendOpen(true)}>Suspend</Button>
            <Button icon={<Ban className="w-4 h-4" />} danger onClick={() => setBanOpen(true)}>Ban</Button>
            <Button
              icon={<Trash2 className="w-4 h-4" />}
              danger type="primary"
              onClick={() => modal.confirm({
                title: `Delete ${user.name}?`,
                content: 'This permanently deletes the account, photos, matches and messages. The action cannot be undone.',
                okText: 'Delete account',
                okButtonProps: { danger: true },
                onOk: () => { message.success(`${user.name} deleted`); navigate('/users'); },
              })}
            >
              Delete
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column - profile */}
        <div className="xl:col-span-1 space-y-6">
          <SectionCard noPadding>
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-semibold">
                  {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-900">{user.name}</div>
                  <div className="text-[12px] text-gray-500">{user.email}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <StatusBadge status={user.status} />
                    <Tag color="cyan" className="!m-0 !text-[11px]">{user.plan}</Tag>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-2.5 text-[13px]">
              <Detail icon={Mail}     label="Email"  value={user.email} />
              <Detail icon={Phone}    label="Phone"  value={user.phone} />
              <Detail icon={MapPin}   label="Loc."   value="Dhaka, Bangladesh" />
              <Detail icon={Calendar} label="Joined" value={user.joinDate} />
              <Detail icon={ShieldCheck} label="Verified" value="Email · Phone · Photo" />
            </div>

            <div className="p-5 border-t border-gray-100">
              <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-2">Bio</div>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                Coffee, hikes on weekends, and a lifelong project of becoming a slightly better cook. Looking
                for someone who prefers a long walk over a long brunch.
              </p>
            </div>

            <div className="p-5 border-t border-gray-100">
              <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-2">Photos</div>
              <div className="grid grid-cols-4 gap-2">
                {photoColors.map((c, i) => (
                  <div key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${c}`} />
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Subscription & billing">
            <div className="space-y-3 text-[13px]">
              <Row k="Current plan"  v={<span className="font-semibold text-gray-900">{user.plan} · monthly</span>} />
              <Row k="Status"        v={<StatusBadge status="active" />} />
              <Row k="Next renewal"  v="2026-06-04" />
              <Row k="Lifetime spend" v="$129.50" />
              <Row k="Payment"       v="Visa •• 4242" />
            </div>
          </SectionCard>
        </div>

        {/* Right column - history, matches, notes */}
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Account status & history">
            <ol className="relative pl-5">
              <span className="absolute left-1.5 top-1 bottom-1 w-px bg-gray-200" />
              {accountTimeline.map(t => (
                <li key={t.id} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-white border-2 border-brand-500" />
                  <div className="text-[13px] text-gray-900 font-medium">{t.label}</div>
                  <div className="text-[11px] text-gray-500">{t.when}</div>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="Match history" description={`${matchHistory.length} recent matches`}>
            <div className="divide-y divide-gray-100">
              {matchHistory.map(m => (
                <div key={m.id} className="py-2.5 flex items-center justify-between">
                  <UserCell name={m.other} />
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[12px] text-gray-500">Messages</div>
                      <div className="text-[13px] font-semibold text-gray-900">{m.messages}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] text-gray-500">Matched</div>
                      <div className="text-[13px] text-gray-700">{m.when}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Reports filed against this user" description={`${reports.length} reports total`}>
            {reports.length === 0 ? (
              <p className="text-[13px] text-gray-500">No reports on file.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {reports.slice(0, 5).map(r => (
                  <div key={r.id} className="py-2.5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[13px] font-medium text-gray-900">{r.reason}</div>
                      <div className="text-[11px] text-gray-500">By {r.reporter} · {r.date}</div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Admin notes"
            action={<Button size="small" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setNoteOpen(true)}>Add note</Button>}
          >
            <div className="space-y-3">
              {notes.map(n => (
                <div key={n.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[12px] font-medium text-gray-800">{n.author}</div>
                    <div className="flex items-center gap-2">
                      <Tag className="!m-0 !text-[10px]" color={n.visibility === 'flagged' ? 'red' : 'default'}>{n.visibility}</Tag>
                      <span className="text-[11px] text-gray-500">{n.when}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-700 leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        open={editOpen}
        user={user}
        onCancel={() => setEditOpen(false)}
        onSave={() => { setEditOpen(false); message.success('Profile updated'); }}
      />
      <AddNoteModal
        open={noteOpen}
        onCancel={() => setNoteOpen(false)}
        onSave={(values) => {
          setNotes(n => [{ id: Date.now(), author: 'Aria Dey', when: '2026-05-06', ...values, body: values.note }, ...n]);
          setNoteOpen(false);
          message.success('Note added');
        }}
      />
      <SuspendUserModal
        open={suspendOpen} user={user}
        onCancel={() => setSuspendOpen(false)}
        onConfirm={({ duration }) => { setSuspendOpen(false); message.success(`${user.name} suspended for ${duration}`); }}
      />
      <BanUserModal
        open={banOpen} user={user}
        onCancel={() => setBanOpen(false)}
        onConfirm={() => { setBanOpen(false); message.success(`${user.name} banned`); }}
      />
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-[12px] text-gray-500 w-14">{label}</span>
      <span className="text-[13px] text-gray-900 truncate">{value}</span>
    </div>
  );
}
function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-gray-500">{k}</span>
      <span className="text-[13px] text-gray-900">{v}</span>
    </div>
  );
}
