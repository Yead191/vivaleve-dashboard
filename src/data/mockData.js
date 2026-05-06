// ───────────────────────────────────────────────────────────────────────────
// Mock data layer. Replace each export with a real API call when wiring up.
// ───────────────────────────────────────────────────────────────────────────

// Dashboard
export const dashboardStats = {
  totalUsers:      { value: '128,492', delta: '+4.2%', dir: 'up',   sub: 'vs last month' },
  dau:             { value: '42,109',  delta: '+1.1%', dir: 'up',   sub: 'today' },
  newSignupsToday: { value: '1,248',   delta: '+8.7%', dir: 'up',   sub: 'today' },
  totalMatches:    { value: '2.4M',    delta: '+0.6%', dir: 'up',   sub: 'all time' },
  openReports:     { value: '37',      delta: '-12%',  dir: 'down', sub: 'pending review' },
  monthlyRevenue:  { value: '$184,720',delta: '+9.4%', dir: 'up',   sub: 'this month' },
};

const days30 = Array.from({ length: 30 }, (_, i) => `D${i + 1}`);

export const dauTrend = days30.map((d, i) => ({
  label: d,
  value: 38000 + Math.round(Math.sin(i / 3) * 2200) + i * 110,
}));

export const signupsTrend = days30.map((d, i) => ({
  label: d,
  value: 700 + Math.round(Math.cos(i / 4) * 180) + i * 12,
}));

export const matchConversionTrend = days30.map((d, i) => ({
  label: d,
  value: 18 + Math.round(Math.sin(i / 5) * 3),
}));

export const recentSignups = [
  { id: 'u_2241', name: 'Maya Chen',      email: 'maya.c@mail.com',     joined: '2m ago',   plan: 'Free' },
  { id: 'u_2240', name: 'Daniel Park',    email: 'd.park@mail.com',     joined: '8m ago',   plan: 'Plus' },
  { id: 'u_2239', name: 'Sara Iqbal',     email: 'sara.iq@mail.com',    joined: '14m ago',  plan: 'Free' },
  { id: 'u_2238', name: 'Liam Murphy',    email: 'liam.m@mail.com',     joined: '22m ago',  plan: 'Free' },
  { id: 'u_2237', name: 'Aiko Tanaka',    email: 'aiko.t@mail.com',     joined: '31m ago',  plan: 'Premium' },
  { id: 'u_2236', name: 'Noah Williams',  email: 'noah.w@mail.com',     joined: '47m ago',  plan: 'Free' },
  { id: 'u_2235', name: 'Priya Sharma',   email: 'priya.s@mail.com',    joined: '1h ago',   plan: 'Plus' },
  { id: 'u_2234', name: 'Carlos Rivera',  email: 'c.rivera@mail.com',   joined: '1h ago',   plan: 'Free' },
  { id: 'u_2233', name: 'Hana Yoon',      email: 'hana.y@mail.com',     joined: '2h ago',   plan: 'Premium' },
  { id: 'u_2232', name: 'Tom Becker',     email: 't.becker@mail.com',   joined: '2h ago',   plan: 'Free' },
];

export const recentReports = [
  { id: 'r_551', target: 'Jordan Lee',    reason: 'Inappropriate photo', when: '4m ago',  status: 'pending' },
  { id: 'r_550', target: 'Mark Zhao',     reason: 'Harassment',          when: '11m ago', status: 'pending' },
  { id: 'r_549', target: 'Anna Petrova',  reason: 'Fake profile',        when: '18m ago', status: 'pending' },
  { id: 'r_548', target: 'Ethan Brooks',  reason: 'Spam messages',       when: '32m ago', status: 'pending' },
  { id: 'r_547', target: 'Sofia Reyes',   reason: 'Underage suspicion',  when: '46m ago', status: 'pending' },
  { id: 'r_546', target: 'Kareem Hassan', reason: 'Scam / phishing',     when: '1h ago',  status: 'reviewed' },
  { id: 'r_545', target: 'Meera Joshi',   reason: 'Hate speech',         when: '1h ago',  status: 'reviewed' },
];

export const recentPurchases = [
  { id: 'p_991', user: 'Liam Murphy',   plan: 'Premium · monthly',  amount: '$14.99', when: '5m ago',  status: 'paid' },
  { id: 'p_990', user: 'Aiko Tanaka',   plan: 'Plus · annual',      amount: '$79.00', when: '13m ago', status: 'paid' },
  { id: 'p_989', user: 'Noah Williams', plan: 'Premium · monthly',  amount: '$14.99', when: '22m ago', status: 'paid' },
  { id: 'p_988', user: 'Priya Sharma',  plan: 'Plus · monthly',     amount: '$7.99',  when: '34m ago', status: 'paid' },
  { id: 'p_987', user: 'Hana Yoon',     plan: 'Premium · annual',   amount: '$129.00',when: '48m ago', status: 'paid' },
  { id: 'p_986', user: 'Tom Becker',    plan: 'Plus · monthly',     amount: '$7.99',  when: '1h ago',  status: 'refunded' },
];

// ─── Users ────────────────────────────────────────────────────────────────
const firstNames = ['Maya','Daniel','Sara','Liam','Aiko','Noah','Priya','Carlos','Hana','Tom','Jordan','Mark','Anna','Ethan','Sofia','Kareem','Meera','Olivia','James','Emma','Ravi','Lucia','Ben','Aria','Ivan','Lena','Sam','Yui','Theo','Zoe'];
const lastNames  = ['Chen','Park','Iqbal','Murphy','Tanaka','Williams','Sharma','Rivera','Yoon','Becker','Lee','Zhao','Petrova','Brooks','Reyes','Hassan','Joshi','Hart','Cole','Diaz','Khan','Mendes','Singh','Doyle','Volkov','Strand','Hill','Aoki','Clark','Bell'];
const statuses = ['active','active','active','active','suspended','banned'];
const plans = ['Free','Free','Free','Plus','Premium','Plus','Premium'];

export const users = Array.from({ length: 60 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last  = lastNames[(i * 3) % lastNames.length];
  return {
    id:        `u_${1000 + i}`,
    name:      `${first} ${last}`,
    email:     `${first.toLowerCase()}.${last.toLowerCase()}@mail.com`,
    phone:     `+1 (555) ${(100 + i).toString().padStart(3, '0')}-${(2000 + i).toString().padStart(4, '0')}`,
    joinDate:  `2025-${String(((i * 13) % 12) + 1).padStart(2, '0')}-${String(((i * 7) % 28) + 1).padStart(2, '0')}`,
    lastActive:`${(i % 24)}h ago`,
    status:    statuses[i % statuses.length],
    plan:      plans[i % plans.length],
    reports:   (i * 3) % 7,
  };
});

export const reportsAgainstUsers = [
  { id: 'r_551', reporter: 'Maya Chen',    target: 'Jordan Lee',   reason: 'Inappropriate photo', date: '2026-05-06', status: 'pending' },
  { id: 'r_550', reporter: 'Daniel Park',  target: 'Mark Zhao',    reason: 'Harassment',          date: '2026-05-06', status: 'pending' },
  { id: 'r_549', reporter: 'Sara Iqbal',   target: 'Anna Petrova', reason: 'Fake profile',        date: '2026-05-06', status: 'pending' },
  { id: 'r_548', reporter: 'Liam Murphy',  target: 'Ethan Brooks', reason: 'Spam messages',       date: '2026-05-05', status: 'pending' },
  { id: 'r_547', reporter: 'Aiko Tanaka',  target: 'Sofia Reyes',  reason: 'Underage suspicion',  date: '2026-05-05', status: 'pending' },
  { id: 'r_546', reporter: 'Noah Williams',target: 'Kareem Hassan',reason: 'Scam / phishing',     date: '2026-05-04', status: 'reviewed' },
  { id: 'r_545', reporter: 'Priya Sharma', target: 'Meera Joshi',  reason: 'Hate speech',         date: '2026-05-04', status: 'reviewed' },
];

// ─── Moderation ─────────────────────────────────────────────────────────
export const flaggedContent = [
  { id: 'f_801', type: 'photo',   reporter: 'Maya Chen',    target: 'Jordan Lee',   reason: 'Inappropriate photo (nudity)', preview: 'A profile photo flagged by 3 users for explicit content.', when: '4m ago',  status: 'pending' },
  { id: 'f_802', type: 'bio',     reporter: 'Sara Iqbal',   target: 'Mark Zhao',    reason: 'Hate speech in bio',            preview: 'Bio contains slurs and language targeting an ethnic group.',  when: '20m ago', status: 'pending' },
  { id: 'f_803', type: 'message', reporter: 'Daniel Park',  target: 'Anna Petrova', reason: 'Harassment in DM',              preview: '"You can\'t ignore me forever, I know where you live..."',     when: '38m ago', status: 'pending' },
  { id: 'f_804', type: 'photo',   reporter: 'Liam Murphy',  target: 'Ethan Brooks', reason: 'Photo of weapon',               preview: 'Profile photo features a firearm prominently displayed.',     when: '1h ago',  status: 'pending' },
  { id: 'f_805', type: 'bio',     reporter: 'Aiko Tanaka',  target: 'Sofia Reyes',  reason: 'External contact info',         preview: 'Bio includes Telegram handle and an external phone number.',  when: '2h ago',  status: 'reviewed' },
  { id: 'f_806', type: 'message', reporter: 'Noah Williams',target: 'Kareem Hassan',reason: 'Scam / phishing link',          preview: '"Click this link to claim your free Premium upgrade…"',       when: '3h ago',  status: 'reviewed' },
];

export const moderationRules = [
  { id: 'mr_1', keyword: 'telegram',         type: 'keyword',     action: 'flag for review', active: true,  created: '2026-01-12' },
  { id: 'mr_2', keyword: 'whatsapp',         type: 'keyword',     action: 'flag for review', active: true,  created: '2026-01-12' },
  { id: 'mr_3', keyword: '\\b\\d{10}\\b',    type: 'regex',       action: 'auto-remove',     active: true,  created: '2026-02-03' },
  { id: 'mr_4', keyword: 'crypto',           type: 'keyword',     action: 'warn user',       active: true,  created: '2026-02-15' },
  { id: 'mr_5', keyword: 'NSFW score > 0.85',type: 'image score', action: 'auto-remove',     active: true,  created: '2026-03-02' },
  { id: 'mr_6', keyword: 'venmo|cashapp',    type: 'regex',       action: 'flag for review', active: false, created: '2026-03-18' },
  { id: 'mr_7', keyword: 'meet outside',     type: 'keyword',     action: 'warn user',       active: true,  created: '2026-04-01' },
];

export const chatLogSearches = [
  { id: 'cl_1', pair: 'Maya Chen ↔ Jordan Lee',     conversationId: 'conv_4422', accessedBy: 'admin@vivaleve', accessedAt: '2026-05-06 11:24', reason: 'Harassment investigation' },
  { id: 'cl_2', pair: 'Daniel Park ↔ Anna Petrova', conversationId: 'conv_4391', accessedBy: 'mod1@vivaleve', accessedAt: '2026-05-06 09:48', reason: 'User report #r_549' },
  { id: 'cl_3', pair: 'Liam Murphy ↔ Ethan Brooks', conversationId: 'conv_4356', accessedBy: 'admin@vivaleve', accessedAt: '2026-05-05 17:12', reason: 'Compliance audit' },
];

// ─── Analytics ──────────────────────────────────────────────────────────
export const analyticsDau = days30.map((d, i) => ({ label: d, value: 36000 + Math.round(Math.sin(i / 4) * 2400) + i * 80 }));
export const wauMau = [
  { label: 'Jan', wau: 168000, mau: 412000 },
  { label: 'Feb', wau: 174000, mau: 425000 },
  { label: 'Mar', wau: 181000, mau: 441000 },
  { label: 'Apr', wau: 188000, mau: 458000 },
  { label: 'May', wau: 196000, mau: 472000 },
];
export const newSignupsBars = days30.map((d, i) => ({ label: d, value: 600 + Math.round(Math.cos(i / 4) * 180) + i * 10 }));
export const churnRate = { value: '3.4%', delta: '-0.4%', dir: 'down' };

export const matchFunnel = [
  { stage: 'Profile views', value: 1_240_000 },
  { stage: 'Likes',         value:   486_000 },
  { stage: 'Matches',       value:   118_400 },
  { stage: 'Messages sent', value:    74_900 },
];

export const retentionCohort = [
  { cohort: 'Apr W1', d1: 62, d7: 38, d14: 27, d30: 19 },
  { cohort: 'Apr W2', d1: 64, d7: 40, d14: 28, d30: 21 },
  { cohort: 'Apr W3', d1: 61, d7: 37, d14: 26, d30: 18 },
  { cohort: 'Apr W4', d1: 66, d7: 41, d14: 30, d30: 22 },
  { cohort: 'May W1', d1: 67, d7: 42, d14: 31, d30: 23 },
];

export const peakHours = Array.from({ length: 7 * 24 }, (_, idx) => {
  const day = Math.floor(idx / 24);
  const hour = idx % 24;
  // synthetic, peaks evenings
  const intensity = Math.round(20 + Math.max(0, Math.sin((hour - 6) / 24 * Math.PI * 2)) * 70 + (day === 5 || day === 6 ? 10 : 0));
  return { day, hour, value: Math.min(100, intensity) };
});

// ─── Monetization ───────────────────────────────────────────────────────
export const subscriptionPlans = [
  { id: 'pl_free',    name: 'Free',     price: 0,     currency: 'USD', cycle: '—',       features: 4,  trialDays: 0,  visible: true,  activeUsers: 96321 },
  { id: 'pl_plus',    name: 'Plus',     price: 7.99,  currency: 'USD', cycle: 'monthly', features: 7,  trialDays: 7,  visible: true,  activeUsers: 21487 },
  { id: 'pl_prem_m',  name: 'Premium',  price: 14.99, currency: 'USD', cycle: 'monthly', features: 12, trialDays: 7,  visible: true,  activeUsers: 9842 },
  { id: 'pl_prem_y',  name: 'Premium Annual',  price: 129,  currency: 'USD', cycle: 'annual',  features: 12, trialDays: 14, visible: true,  activeUsers: 4218 },
  { id: 'pl_legacy',  name: 'Legacy Pro',price: 4.99, currency: 'USD', cycle: 'monthly', features: 5,  trialDays: 0,  visible: false, activeUsers: 312 },
];

export const revenueStats = {
  mrr: { value: '$184,720', delta: '+9.4%', dir: 'up' },
  arr: { value: '$2.21M',   delta: '+11.2%',dir: 'up' },
  refunds: { value: 28, total: '$684.16' },
};

export const revenueByPlan = [
  { label: 'Premium Monthly',  value: 142000 },
  { label: 'Premium Annual',   value: 184000 },
  { label: 'Plus',             value:  86000 },
  { label: 'Legacy Pro',       value:   3200 },
];

export const monthlyRevenue = [
  { label: 'Nov', value: 142000 },
  { label: 'Dec', value: 156000 },
  { label: 'Jan', value: 161000 },
  { label: 'Feb', value: 169000 },
  { label: 'Mar', value: 175000 },
  { label: 'Apr', value: 178000 },
  { label: 'May', value: 184720 },
];

export const purchases = Array.from({ length: 24 }, (_, i) => ({
  id: `p_${980 - i}`,
  user: users[i % users.length].name,
  plan: ['Plus · monthly', 'Premium · monthly', 'Premium · annual', 'Plus · annual'][i % 4],
  amount: ['$7.99', '$14.99', '$129.00', '$79.00'][i % 4],
  date: `2026-05-${String(6 - (i % 6)).padStart(2, '0')}`,
  method: ['Visa •• 4242', 'Mastercard •• 8841', 'Apple Pay', 'PayPal'][i % 4],
  status: ['paid', 'paid', 'paid', 'refunded', 'paid', 'failed'][i % 6],
}));

export const promoCodes = [
  { id: 'pc_1', code: 'WELCOME20',   discountType: 'percent', discount: 20, maxUses: 1000, used: 432, expiry: '2026-06-30', planRestriction: 'Plus, Premium', status: 'active'  },
  { id: 'pc_2', code: 'SUMMER50',    discountType: 'percent', discount: 50, maxUses: 500,  used: 88,  expiry: '2026-08-15', planRestriction: 'Premium',       status: 'active'  },
  { id: 'pc_3', code: 'LAUNCH5',     discountType: 'fixed',   discount: 5,  maxUses: 5000, used: 4912,expiry: '2026-04-01', planRestriction: 'Any',           status: 'expired' },
  { id: 'pc_4', code: 'CREATOR15',   discountType: 'percent', discount: 15, maxUses: 200,  used: 47,  expiry: '2026-12-31', planRestriction: 'Premium',       status: 'active'  },
  { id: 'pc_5', code: 'STUDENT30',   discountType: 'percent', discount: 30, maxUses: 1000, used: 612, expiry: '2026-09-30', planRestriction: 'Plus',          status: 'active'  },
];

// ─── Messaging ──────────────────────────────────────────────────────────
export const safetyTemplates = [
  { id: 'st_1', title: 'Meeting safely',         body: 'Always meet in public for first dates. Tell a friend where you’re going.', frequency: 'every 30 days', active: true },
  { id: 'st_2', title: 'Photo verification',     body: 'Verify your profile photos to get a blue badge and 2× more matches.',      frequency: 'on signup',     active: true },
  { id: 'st_3', title: 'Beware of scams',        body: 'Never send money to someone you met on VivaLeve. Report suspicious DMs.',  frequency: 'every 60 days', active: true },
  { id: 'st_4', title: 'Profile completion tip', body: 'Profiles with 4+ photos get up to 3× more matches. Add more photos!',     frequency: 'one-time',      active: false },
];

export const sendHistory = [
  { id: 'sh_1', title: 'Spring Premium offer',   audience: 'Free users · all regions', sentAt: '2026-05-04 14:00', delivered: 96400, openRate: '38.2%', type: 'push + in-app', live: false },
  { id: 'sh_2', title: 'Safety reminder · meet', audience: 'Active users',             sentAt: '2026-05-02 09:00', delivered: 41200, openRate: '64.1%', type: 'in-app',        live: true  },
  { id: 'sh_3', title: 'Inactive 7d nudge',      audience: 'Inactive 7d',              sentAt: '2026-04-30 18:00', delivered: 12480, openRate: '21.8%', type: 'push',          live: false },
  { id: 'sh_4', title: 'New feature · Boost',    audience: 'All users',                sentAt: '2026-04-27 12:00', delivered: 124000,openRate: '47.3%', type: 'push + in-app', live: false },
];

// ─── Config ─────────────────────────────────────────────────────────────
export const featureFlags = [
  { id: 'ff_1', key: 'video_calls',        description: 'Enable in-app video calls between matches', env: 'prod',    status: false },
  { id: 'ff_2', key: 'ai_icebreakers',     description: 'AI-suggested opening messages',             env: 'prod',    status: true  },
  { id: 'ff_3', key: 'voice_notes',        description: 'Record & send voice notes in DMs',          env: 'staging', status: true  },
  { id: 'ff_4', key: 'verified_only_mode', description: 'User can choose to only see verified',      env: 'prod',    status: true  },
  { id: 'ff_5', key: 'experiment_swipe2',  description: 'New swipe gesture A/B test',                env: 'dev',     status: true  },
  { id: 'ff_6', key: 'live_events',        description: 'Curated speed-dating events',               env: 'staging', status: false },
];

export const defaultSettings = {
  maxSwipesPerDayFree: 50,
  maxPhotosPerProfile: 6,
  matchRadiusKm:       50,
  ageRangeMin:         18,
  ageRangeMax:         60,
  messageCharLimit:    1000,
  profileVisibility:   'public',
};

export const localizationStrings = [
  { id: 'ls_1', key: 'home.greeting',     en: 'Welcome back',              es: 'Bienvenido de nuevo',  fr: 'Bon retour',          ja: 'おかえりなさい' },
  { id: 'ls_2', key: 'match.new',         en: 'You have a new match!',     es: '¡Tienes un nuevo match!', fr: 'Vous avez un nouveau match !', ja: '新しいマッチがあります！' },
  { id: 'ls_3', key: 'profile.edit',      en: 'Edit profile',              es: 'Editar perfil',         fr: 'Modifier le profil',  ja: 'プロフィール編集' },
  { id: 'ls_4', key: 'settings.privacy',  en: 'Privacy settings',          es: 'Configuración de privacidad', fr: 'Paramètres de confidentialité', ja: 'プライバシー設定' },
  { id: 'ls_5', key: 'subscription.upgrade', en: 'Upgrade to Premium',     es: 'Actualizar a Premium',  fr: 'Passer à Premium',    ja: 'プレミアムにアップグレード' },
  { id: 'ls_6', key: 'report.submit',     en: 'Submit report',             es: 'Enviar reporte',        fr: 'Soumettre un rapport',ja: '報告する' },
];

export const locales = ['en', 'es', 'fr', 'ja'];
