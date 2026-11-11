

const ME = {
  name: 'Juan D.', full: 'Juan Dela Cruz', om: 'OM 102 938 475', email: 'juan.dc@example.com', phone: '+63 917 555 0142',
  wallet: 25800, tier: 'Elite', next: 'Premium', tierPts: 320, tierGoal: 500,
  circle: 48250, lifestyle: 6420, expiring: { pts: 3200, type: 'Circle Points', date: 'Dec 31' }, discount: 0.10,
  card: '•••• 1111',

  cards: [{ id: 'cd1', brand: 'Visa', last4: '1111', exp: '12/29', def: true }, { id: 'cd2', brand: 'Mastercard', last4: '5454', exp: '08/28' }],
  vouchers: [{ code: 'VC-DN7K2Q', title: '₱2,000 Dining Voucher', value: 2000, kinds: ['dine', 'shop'], used: null }],
};
const PTS = { circle: 'Circle Points', lifestyle: 'Lifestyle Points' };

const ELIG = { stay: ['circle'], dine: ['circle', 'lifestyle'], wellness: ['circle', 'lifestyle'], shop: ['circle', 'lifestyle'], event: ['circle', 'lifestyle'], reward: ['circle', 'lifestyle'], voucher: ['circle'] };

const ROOMS = [

  { id: 'dk', cat: 'rooms', title: 'Deluxe Room', meta: '58 sqm · City view · 1 King bed', base: 14500, left: 5 },
  { id: 'dt', cat: 'rooms', title: 'Grand Deluxe Twin Room', meta: '64 sqm · Garden view · 2 Queen beds', base: 13800, left: 9 },
  { id: 'pk', cat: 'rooms', title: 'Grand Deluxe Room', meta: '64 sqm · Manila Bay view', base: 17200, left: 2, tag: 'hot' },
  { id: 'js', cat: 'suites', title: 'Junior Suite', meta: '110 sqm · Bay view · Lounge access', base: 28000, left: 3 },
  { id: 'bs', cat: 'suites', title: 'Manila Bay Suite', meta: '150 sqm · Panoramic bay view', base: 42000, left: 1, tag: 'new' },
  { id: 'os', cat: 'suites', title: 'Presidential Suite', meta: '220 sqm · Butler service', base: 68000, left: 0 },
  { id: 'gv', cat: 'villas', title: 'Two-Bedroom Garden Suite', meta: '300 sqm · Private garden', base: 120000, left: 1 },
  { id: 'pv', cat: 'villas', title: 'Villa El Nido', meta: '400 sqm · Private pool', base: 150000, left: 0 },
];
const RATES = [

  { code: 'MBR', name: 'Member Flexible Rate', desc: 'Free cancellation until 48h before arrival', mult: 1 - ME.discount, refundable: true, member: true },
  { code: 'MAP', name: 'Member Advance Purchase', desc: 'Non-refundable · Breakfast included', mult: 0.78, refundable: false, member: true },
];
const STAY_TABS = [['all', 'All'], ['rooms', 'Rooms'], ['suites', 'Suites'], ['villas', 'Villas']];

const RESTS = [
  { id: 'yz', title: 'Kappou Yoshi', cuisine: 'Japanese', meta: 'Kappo-style Japanese', tag: 'hot' },
  { id: 'rl', title: 'Goryeo', cuisine: 'Korean', meta: 'Korean barbecue' },
  { id: 'lp', title: 'La Piazza', cuisine: 'Italian', meta: 'Trattoria & pizzeria' },
  { id: 'rs', title: 'Red Spice', cuisine: 'Asian', meta: 'Pan-Asian buffet' },
  { id: 'kp', title: 'Kiapo', cuisine: 'Filipino', meta: 'Modern Filipino', tag: 'new' },
  { id: 'md', title: 'Medley Buffet', cuisine: 'International', meta: 'All-day buffet' },
  { id: 'gn', title: 'Ginza Nagaoka', cuisine: 'Japanese', meta: 'Omakase counter · 10 seats', deposit: 5000 },
  { id: 'el', title: 'Executive Lounge', cuisine: 'Lounges', meta: 'Suite & villa guests' },
  { id: 'ol', title: 'Lobby Lounge', cuisine: 'Lounges', meta: 'Afternoon tea & pastries' },
];
const DINE_TABS = [['all', 'All'], ['Japanese', 'Japanese'], ['Chinese', 'Chinese'], ['Italian', 'Italian'], ['Asian', 'Asian'], ['Filipino', 'Filipino'], ['International', 'International'], ['Lounges', 'Bars & Lounges']];
const DINE_SLOTS = ['11:30', '12:00', '12:30', '13:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

const PRODUCTS = [
  { id: 'spa', mod: 'wellness', shop: true, cat: 'spa', title: 'The Retreat Spa Experience', meta: '120 min · Signature ritual', opts: [['Single', 8888], ['Couple', 16888]], slots: ['10:00', '12:30', '15:00', '17:30', '20:00'], tag: 'hot' },
  { id: 'fr', mod: 'wellness', shop: true, cat: 'reflex', title: 'Foot Reflexology', meta: 'The Sole Retreat', opts: [['60 min', 2750], ['90 min', 3850]], slots: ['11:00', '13:00', '15:00', '17:00', '19:00', '21:00'] },
  { id: 'fc', mod: 'wellness', cat: 'spa', title: 'Signature Facial', meta: '75 min · The Retreat Spa', opts: [['75 min', 4200]], slots: ['10:00', '13:00', '16:00', '19:00'] },
  { id: 'hc', mod: 'wellness', cat: 'fitness', title: 'Fitness & Gym Day Pass', meta: 'Okada PowerFit · Pool access', opts: [['Day Pass', 1200], ['Day Pass + Guest', 2000]], slots: ['06:00', '09:00', '14:00', '18:00'] },
  { id: 'mn', mod: 'wellness', cat: 'spa', title: 'Aromatherapy Massage', meta: '90 min · The Retreat Spa', opts: [['60 min', 4800], ['90 min', 6200]], slots: ['10:30', '13:30', '16:30', '19:30'], tag: 'new' },
  { id: 'kcw', mod: 'shop', shop: true, cat: 'experience', title: 'Kids Club Weekday Pass', meta: 'Ages 3–12 · Mon–Fri · 4 hours', opts: [['Weekday · 4 hours', 1500]], slots: ['10:00', '14:00'], days: 'weekday' },
  { id: 'kce', mod: 'shop', shop: true, cat: 'experience', title: 'Kids Club Weekend Pass', meta: 'Ages 3–12 · Sat–Sun · 4 hours', opts: [['Weekend · 4 hours', 1800]], slots: ['10:00', '14:00'], days: 'weekend' },
  { id: 'thr', mod: 'shop', shop: true, cat: 'experience', title: 'Thrillscape', meta: 'VR & simulator park', opts: [['3 Attractions', 1200], ['Unlimited Day Pass', 2500]], slots: ['11:00', '14:00', '17:00', '20:00'], tag: 'hot' },
  { id: 'lpz', mod: 'shop', shop: true, cat: 'dining', title: 'La Piazza Dinner for Two', meta: 'Set menu · Dine-in', opts: [['Set menu for two', 4500]], slots: ['18:00', '19:00', '20:00'] },
  { id: 'rsp', mod: 'shop', shop: true, cat: 'dining', title: 'Red Spice Buffet', meta: 'Pan-Asian buffet', opts: [['Lunch', 2200], ['Dinner', 2800]], slots: ['11:30', '18:00'] },
  { id: 'egv', mod: 'shop', shop: true, cat: 'voucher', title: '₱1,000 e-Gift Voucher', meta: 'Use at any outlet · Valid 12 months', opts: [['₱1,000', 1000]], noDate: true, noDisc: true, tag: 'new' },
];
const WELL_TABS = [['all', 'All'], ['spa', 'Spa'], ['reflex', 'Reflexology'], ['beauty', 'Beauty'], ['barber', 'Barber'], ['nail', 'Nails']];
const SHOP_TABS = [['all', 'All'], ['experience', 'Experiences'], ['wellness', 'Wellness'], ['dining', 'Dining'], ['voucher', 'Gift Vouchers']];
const shopCat = p => p.mod === 'wellness' ? 'wellness' : p.cat;

const COLLECTIONS = [

  { id: 'c-ip', title: 'Pandora ₱5,000 Gift Card', pts: 5000, stock: 20, tag: 'hot', img: 'resort/img/col/pandora.webp' },
  { id: 'c-bo', title: 'Jo Malone London ₱3,000 Gift Card', pts: 3000, stock: 30, img: 'resort/img/col/jomalone.webp' },
  { id: 'c-wn', title: 'Charriol ₱60,000 Gift Card', pts: 60000, stock: 3, img: 'resort/img/col/charriol.webp' },
  { id: 'c-rb', title: 'Michael Kors ₱5,000 Gift Card', pts: 5000, stock: 15, img: 'resort/img/col/mk.webp' },
  { id: 'c-tm', title: 'Porsche Design ₱8,000 Gift Card', pts: 8000, stock: 10, tag: 'new', img: 'resort/img/col/porsche.webp' },
  { id: 'c-lg', title: 'Samsonite ₱6,000 Gift Card', pts: 6000, stock: 0, img: 'resort/img/col/samsonite.webp' },
];
const VOUCHERS = [
  { id: 'v-st', title: '₱5,000 Stay Voucher', pts: 5000, value: 5000, kinds: ['stay'], types: ['circle'], img: 'resort/rooms/dk.webp' },
  { id: 'v-dn', title: '₱2,000 Dining Voucher', pts: 2000, value: 2000, kinds: ['dine', 'shop'], types: ['circle', 'lifestyle'], img: 'resort/img/col/evoucher.webp' },
  { id: 'v-sp', title: '₱3,000 Spa Voucher', pts: 3000, value: 3000, kinds: ['wellness', 'shop'], types: ['circle', 'lifestyle'], img: 'resort/img/p-spa.webp' },
  { id: 'v-kc', title: '₱1,500 Kids Club Voucher', pts: 1500, value: 1500, kinds: ['shop'], types: ['circle', 'lifestyle'], tag: 'new', img: 'resort/img/p-kce.webp' },
];

const PROMOS = [
  { id: 'o1', cat: 'online', title: 'Newbie Bonus Rush', meta: 'New members · Welcome bonus', price: 'Opt-in', tag: 'hot' },
  { id: 'o2', cat: 'online', title: 'Habanero Happy Hour', meta: 'Habanero slots · Daily happy hour', price: 'Opt-in' },
  { id: 'o3', cat: 'online', title: 'The Legacy of 10', meta: 'Live tables · Weekly leaderboard', price: 'Opt-in' },
  { id: 'o4', cat: 'online', title: 'Refer and Earn', meta: 'Invite friends · Earn rewards', price: 'Opt-in', tag: 'new' },
  { id: 'c1', cat: 'onsite', title: 'Cash Chase', meta: 'PHP 1,000,000 weekly cash grand prize · Tax-free', price: 'Members', left: 64, tag: 'hot', date: dayPlus(12) },
  { id: 'c2', cat: 'onsite', title: 'Gen 18', meta: 'Rise in ranks. Rise in rewards.', price: 'Members', left: 120, date: dayPlus(4) },
  { id: 'c3', cat: 'onsite', title: 'Winzone Lucky Pick Thursday', meta: 'Every Thursday · Log in, pick your prize', price: 'Free entry', left: 999, date: dayPlus(2) },
  { id: 'c6', cat: 'onsite', title: 'Merry Pay Day Raffle', meta: 'Dec 15 & 30 · Bet PHP 500 on eligible Live Slots and Live Tables', price: 'Free entry', left: 999, tag: 'new', date: dayPlus(35) },
  { id: 'c5', cat: 'onsite', title: 'Bounce Back Your Play', meta: 'Play and be rewarded daily', price: 'Members', left: 200, date: dayPlus(5) },

  { id: 'sp1', cat: 'stay', title: 'Exclusive Mobile Rate', meta: 'Book online · Breakfast for two', price: '2 nights', stay: { ci: 'fri', n: 2, scat: 'rooms' }, tag: 'hot' },
  { id: 'sp2', cat: 'stay', title: 'Early Bird Exclusive Savings', meta: 'Book 30 days ahead · Suites', price: '3 nights', stay: { ci: 7, n: 3, scat: 'suites' } },
  { id: 'sp3', cat: 'stay', title: 'Bespoke Celebrations By The Bay', meta: 'Birthdays · Anniversaries · Proposals', price: 'On request', info: 'Our celebrations team will tailor décor, cake and in-room set-up. Contact the concierge to arrange.', tag: 'new' },
  { id: 'd1', cat: 'dining', title: 'Savor The Show Around The World', meta: 'Medley Buffet · Global food stations', price: 'Reserve', rest: 'md', tag: 'hot' },
  { id: 'd2', cat: 'dining', title: 'Visa Dine and Save', meta: 'La Piazza · Pay with Visa and save', price: 'Reserve', rest: 'lp' },
  { id: 'd3', cat: 'dining', title: 'Bingsu', meta: 'Goryeo · Korean shaved ice', price: 'Reserve', rest: 'rl', tag: 'new' },
  { id: 'n1', cat: 'entertainment', title: 'Countdown Party', meta: 'Dec 31 · The Cove', price: '₱3,500', priceN: 3500, left: 120, tag: 'hot', date: dayPlus(51) },
  { id: 'n2', cat: 'entertainment', title: 'The Fountain Show', meta: 'Nightly 19:00–23:00', price: 'Free', left: 999, date: dayPlus(0) },
  { id: 'n3', cat: 'entertainment', title: 'Party With The Magic', meta: 'Every Friday · The Cove', price: '₱1,500', priceN: 1500, left: 40, date: dayPlus(3) },
  { id: 'n4', cat: 'entertainment', title: 'Tree Lighting Ceremony', meta: 'Nov 30 · The Fountain', price: 'Free', left: 999, tag: 'new', date: dayPlus(20) },
  { id: 'w1', cat: 'wellness', title: 'Sunrise Yoga', meta: 'Sat 07:00 · Okada PowerFit', price: '₱800', priceN: 800, left: 0, date: dayPlus(4) },
  { id: 'w2', cat: 'wellness', title: 'Spa Week', meta: 'Members 10% off all treatments', price: 'Book', prod: 'spa', tag: 'hot' },
  { id: 's3', cat: 'shopping', title: 'Thrillscape Ultra Champion 2026', meta: 'Unlimited Day Pass · Weekends', price: 'From ₱2,500', prod: 'thr', tag: 'hot' },
  { id: 's1', cat: 'shopping', title: "Shopper's and Diner's Circle", meta: 'Spend and earn rewards', price: 'In-store', info: 'Show your Reward Circle card at participating stores and restaurants. Offers vary by outlet.', tag: 'new' },
  { id: 's2', cat: 'shopping', title: 'Golden Treasures Collection', meta: 'Limited edition · The Shoppes', price: 'In-store', info: 'Available at participating stores. Members earn Lifestyle Points on every purchase.' },
];

const PROMO_TABS = [['all', 'All'], ['online', 'Online Casino'], ['onsite', 'On-site Casino']];
const PAGE_PROMO = { stay: 'stay', dine: 'dining', wellness: 'wellness', ent: 'entertainment', shop: 'shopping' };
const PROMO_KICK = { online: 'ONLINE CASINO', onsite: 'CASINO · ON-SITE', dining: 'DINING', entertainment: 'ENTERTAINMENT', wellness: 'WELLNESS', shopping: 'SHOPPING' };
const HIGHLIGHTS = [
  { route: 'stay', kicker: 'STAY', title: 'Member Rate · Deluxe Room', meta: 'From ₱13,050 · Pay with points', tag: 'hot', img: 'resort/rooms/dk.webp' },
  { route: 'dine', kicker: 'DINE', title: 'Kappou Yoshi', meta: 'Tonight 19:00 available', img: 'resort/img/r-yz.webp' },
  { route: 'wellness', kicker: 'WELLNESS', title: 'The Retreat Spa Experience', meta: '₱8,888 · Member 10% off', img: 'resort/img/p-spa.webp' },
  { route: 'rewards', kicker: 'REWARDS', title: 'Reward Circle', meta: 'Earn and use your points', img: 'resort/img/h-rewards.webp' },
  { route: 'ent', kicker: 'ENTERTAINMENT', title: 'Countdown Party', meta: 'Dec 31 · The Cove', img: 'resort/img/e-n1.webp' },
  { route: 'promo', kicker: 'ONLINE CASINO', title: 'Newbie Bonus Rush', meta: 'New members · Opt-in', tag: 'new' },
];
const RIMG = { rest: id => `resort/img/r-${id}.webp`, prod: id => `resort/img/p-${id}.webp`, promo: id => `resort/img/e-${id}.webp` };
const KIND = { stay: ['STAY', 'Stay'], dine: ['DINE', 'Dining'], wellness: ['SPA', 'Wellness'], shop: ['SHOP', 'E-Shop'], event: ['EVT', 'Entertainment'], reward: ['RC', 'Rewards'] };
const STATUS = { PENDING_PAYMENT: 'Awaiting Payment', PAID: 'Paid', CONFIRMED: 'Confirmed', FAILED: 'Payment Failed', REFUNDED: 'Refunded', CANCELLED: 'Cancelled', EXPIRED: 'Expired' };

const S = {
  login: false, fail: false, synxFail: false, lang: 'en',
  ptcat: 'all', gf: {}, fav: new Set(), recent: [], scat: 'all', dcat: 'all', wcat: 'all', shcat: 'all', pcat: 'all', bkcat: 'all', joined: new Set(),
  stayQ: { ci: dayPlus(3), co: dayPlus(5), rooms: 1, ad: 2, ch: 0 },
  draft: null, co: {}, orders: [], ledger: [], ptsLog: [], idem: new Map(), after: null, param: null, gw: null,
};
