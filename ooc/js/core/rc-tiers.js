
const RC_TIERS = [
 {
  "id": "prime",
  "name": "Prime",
  "min": 0,
  "req": "Free Sign-up",
  "conv": "1 Tier Point = 4 Circle Points",
  "img": "resort/img/rc-prime.webp",
  "cats": {
   "Casino": [
    "Newsletter Offer",
    "SMS and E-mail Offers",
    "Earn and Redeem Rewards",
    "Birthday Offer¹",
    "Okada Online Casino (Only within the Philippines)",
    "Access to High Limit"
   ],
   "Hotel": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Points Redemption Special Room Rates²",
    "Free Parking",
    "Electric Vehicle Charging Services",
    "Waterless Carwash Services Discount",
    "Car Hire Discount²",
    "Auto Wi-Fi Connection",
    "Auto Wi-Fi Connection Speed/Bandwidth"
   ],
   "Spa, Salon & Lifestyle": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Les Fleurs (Flower Shop) Discount",
    "The Sole Retreat Discount (60-Minute Treatment)",
    "The Retreat Spa Discount (60 to 120-Minute Treatments)",
    "Beauty Salon, Nail Art Studio, and Barber Shop Discount",
    "Spa Boutique Discount on Select Merchandise",
    "Thrillscape Discount",
    "Thrillscape Discount on Select Merchandise",
    "Discount on Okada Kids Club Access",
    "Discount on Okada Kids Club Merchandise"
   ],
   "Dining": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Dining Discount – Medley⁵",
    "Dining Discount – Lobby Lounge⁵",
    "Dining Discount – Pool Bar⁵",
    "Dining Discount – Goryeo Korean Dining⁵",
    "Dining Discount – Enbu⁵",
    "Dining Discount – La Piazza⁵",
    "Dining Discount – Red Spice⁵",
    "Dining Discount – Kiapo⁵",
    "Dining Discount – Perlas Dining⁵",
    "Dining Discount – Okada Dining⁵",
    "Dining Discount – Okada Lounge⁵",
    "Dining Discount – The Coral Lounge⁵",
    "Dining Discount – Roasting by Red Spice⁵",
    "Dining Discount – Ryuchi Ramen⁵",
    "Dining Discount – Curry Corner⁵"
   ],
   "Retail": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "The Gift Boutique Discount on Select Merchandise",
    "Member-exclusive Promotions at Selected Outlets"
   ]
  }
 },
 {
  "id": "elite",
  "name": "Elite",
  "min": 100,
  "req": "Earn 100 Tier Points to upgrade",
  "conv": "1 Tier Point = 8 Circle Points",
  "img": "resort/img/rc-elite.webp",
  "cats": {
   "Casino": [
    "Newsletter Offer",
    "SMS and E-mail Offers",
    "Earn and Redeem Rewards",
    "Birthday Offer¹",
    "Okada Online Casino (Only within the Philippines)",
    "Access to High Limit",
    "Invitation to Tournaments, Promotions, and Events¹"
   ],
   "Hotel": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Points Redemption Special Room Rates²",
    "Free Parking",
    "Electric Vehicle Charging Services",
    "Waterless Carwash Services Discount",
    "Airport Lounge Access",
    "Car Hire Discount²",
    "Auto Wi-Fi Connection",
    "Auto Wi-Fi Connection Speed/Bandwidth"
   ],
   "Spa, Salon & Lifestyle": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Les Fleurs (Flower Shop) Discount",
    "Sole Retreat Discount (60-Minute Treatment)",
    "Retreat Spa Discount (60 to 120-Minute Treatments)",
    "Beauty Salon and Barbershop Discount",
    "Spa Boutique Discount for Regular-priced Items",
    "Thrillscape Discount",
    "Thrillscape Discount on Select Merchandise",
    "Discount on Okada Kids Club Access",
    "Discount on Okada Kids Club Merchandise"
   ],
   "Dining": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Dining Discount – Medley⁵",
    "Dining Discount – Lobby Lounge⁵",
    "Dining Discount – Pool Bar⁵",
    "Dining Discount – Goryeo Korean Dining⁵",
    "Dining Discount – Enbu⁵",
    "Dining Discount – La Piazza⁵",
    "Dining Discount – Red Spice⁵",
    "Dining Discount – Kiapo⁵",
    "Dining Discount – Perlas Dining⁵",
    "Dining Discount – Okada Dining⁵",
    "Dining Discount – Okada Lounge⁵",
    "Dining Discount – The Coral Lounge⁵",
    "Dining Discount – Roasting by Red Spice⁵",
    "Dining Discount – Ryuchi Ramen⁵",
    "Dining Discount – Curry Corner⁵"
   ],
   "Retail": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "The Gift Boutique Discount",
    "Member-exclusive Promotions at Selected Outlets"
   ]
  }
 },
 {
  "id": "premium",
  "name": "Premium",
  "min": 500,
  "req": "Earn 500 Tier Points to upgrade",
  "conv": "1 Tier Point = 10 Circle Points",
  "img": "resort/img/rc-premium.webp",
  "cats": {
   "Casino": [
    "Newsletter Offer",
    "SMS and E-mail Offers",
    "Earn and Redeem Rewards",
    "Birthday Offer¹",
    "Okada Online Casino (Only within the Philippines)",
    "Invitation to Tournaments, Promotions, and Events¹",
    "Access to High Limit",
    "Invitation to Special Events¹",
    "Personalized Events and Rewards¹",
    "Complimentary Room Offers¹",
    "Exclusive Dinner Invitation¹"
   ],
   "Hotel": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Points Redemption Special Room Rates²",
    "Free Parking",
    "Electric Vehicle Charging Services",
    "Waterless Carwash Services Discount",
    "Car Hire Discount²",
    "Auto Wi-Fi Connection",
    "Auto Wi-Fi Connection Speed/Bandwidth",
    "Best Hotel Rate Guarantee (cash rate)",
    "Complimentary Local Landline Calls",
    "Airport Lounge Access"
   ],
   "Spa, Salon & Lifestyle": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Les Fleurs (Flower Shop) Discount",
    "Sole Retreat Discount (60-Minute Treatment)",
    "Retreat Spa Discount (60 to 120-Minute Treatments)",
    "Beauty Salon and Barbershop Discount",
    "Spa Boutique Discount for Regular-priced Items",
    "Thrillscape Discount",
    "Thrillscape Discount on Select Merchandise",
    "Discount on Okada Kids Club Access",
    "Discount on Okada Kids Club Merchandise"
   ],
   "Dining": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Dining Discount – Medley⁵",
    "Dining Discount – Lobby Lounge⁵",
    "Dining Discount – Pool Bar⁵",
    "Dining Discount – Goryeo Korean Dining⁵",
    "Dining Discount – Enbu⁵",
    "Dining Discount – La Piazza⁵",
    "Dining Discount – Red Spice⁵",
    "Dining Discount – Kiapo⁵",
    "Dining Discount – Perlas Dining⁵",
    "Dining Discount – Okada Dining⁵",
    "Dining Discount – Okada Lounge⁵",
    "Dining Discount – The Coral Lounge⁵",
    "Dining Discount – Roasting by Red Spice⁵",
    "Dining Discount – Ryuchi Ramen⁵",
    "Dining Discount – Curry Corner⁵",
    "Special Birthday Surprise in La Piazza"
   ],
   "Retail": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "The Gift Boutique Discount",
    "Member-exclusive Promotions at Selected Outlets"
   ]
  }
 },
 {
  "id": "supreme",
  "name": "Supreme",
  "min": 2500,
  "req": "Earn 2,500 Tier Points to upgrade",
  "conv": "1 Tier Point = 12 Circle Points",
  "img": "resort/img/rc-supreme.webp",
  "cats": {
   "Casino": [
    "Newsletter Offer",
    "SMS and E-mail Offers",
    "Earn and Redeem Rewards",
    "Birthday Offer¹",
    "Okada Online Casino (Only within the Philippines)",
    "Invitation to Tournaments, Promotions, and Events¹",
    "Access to High Limit",
    "Invitation to Special Events¹",
    "Personalized Events and Rewards¹",
    "Complimentary Room Offers¹",
    "Exclusive Dinner Invitation¹",
    "Dedicated Host Service¹"
   ],
   "Hotel": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Points Redemption Special Room Rates²",
    "Free Parking",
    "Electric Vehicle Charging Services",
    "Waterless Carwash Services Discount",
    "Car Hire Discount²",
    "Auto Wi-Fi Connection",
    "Auto Wi-Fi Connection Speed/Bandwidth",
    "Best Hotel Rate Guarantee (cash rate)",
    "Complimentary Local Landline Calls",
    "VIP Hotel Check in",
    "Late Check-Out (Until 14:00H)²",
    "Room Upgrade²",
    "Laundry Services (wash / press / dry-clean)⁴",
    "Free Valet Parking",
    "Airport Lounge Access"
   ],
   "Spa, Salon & Lifestyle": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Les Fleurs (Flower Shop) Discount",
    "Sole Retreat Discount (60-Minute Treatment)",
    "Retreat Spa Discount (60 to 120-Minute Treatments)",
    "Beauty Salon and Barbershop Discount",
    "Spa Boutique Discount for Regular-priced Items",
    "Thrillscape Discount",
    "Thrillscape Discount on Select Merchandise",
    "Discount on Okada Kids Club Access",
    "Discount on Okada Kids Club Merchandise"
   ],
   "Dining": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Dining Discount – Medley⁵",
    "Dining Discount – Lobby Lounge⁵",
    "Dining Discount – Pool Bar⁵",
    "Dining Discount – Goryeo Korean Dining⁵",
    "Dining Discount – Enbu⁵",
    "Dining Discount – La Piazza⁵",
    "Dining Discount – Red Spice⁵",
    "Dining Discount – Kiapo⁵",
    "Dining Discount – Perlas Dining⁵",
    "Dining Discount – Okada Dining⁵",
    "Dining Discount – Okada Lounge⁵",
    "Dining Discount – The Coral Lounge⁵",
    "Dining Discount – Roasting by Red Spice⁵",
    "Dining Discount – Ryuchi Ramen⁵",
    "Dining Discount – Curry Corner⁵",
    "Special Birthday Surprise in La Piazza"
   ],
   "Retail": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "The Gift Boutique Discount",
    "Member-exclusive Promotions at Selected Outlets"
   ]
  }
 },
 {
  "id": "maharlika",
  "name": "Maharlika",
  "min": 15000,
  "req": "Earn 15,000 Tier Points to upgrade",
  "conv": "1 Tier Point = 16 Circle Points",
  "img": "resort/img/rc-maharlika.webp",
  "cats": {
   "Casino": [
    "Newsletter Offer",
    "SMS and E-mail Offers",
    "Earn and Redeem Rewards",
    "Birthday Offer¹",
    "Okada Online Casino (Only within the Philippines)",
    "Invitation to Tournaments, Promotions, and Events¹",
    "Access to High Limit",
    "Invitation to Special Events¹",
    "Personalized Events and Rewards¹",
    "Complimentary Room Offers¹",
    "Exclusive Dinner Invitation¹",
    "Dedicated Host Service¹",
    "Debit/Credit Card Transaction Fee Rebate",
    "Access to Perlas Club",
    "Access to Maharlika Club",
    "Access to Okada VIP Club",
    "Priority Reservation of Private Salons²",
    "Dedicated VIP Hotline",
    "Cage Cashier Priority Lane (peak hours only)",
    "Currency Exchange: Best Rate on FOREX"
   ],
   "Hotel": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Points Redemption Special Room Rates²",
    "Free Parking",
    "Electric Vehicle Charging Services",
    "Airport Lounge Access",
    "Waterless Carwash Services Discount",
    "Car Hire Discount²",
    "Auto Wi-Fi Connection",
    "Auto Wi-Fi Connection Speed/Bandwidth",
    "Best Hotel Rate Guarantee (cash rate)",
    "Complimentary Local Landline Calls",
    "VIP Hotel Check in",
    "Late Check-Out (Until 14:00H)²",
    "Room Upgrade²",
    "Laundry Services (wash / press / dry-clean)⁴",
    "Free Valet Parking",
    "Butler Services for 2 Bedroom Suites and above"
   ],
   "Spa, Salon & Lifestyle": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Les Fleurs (Flower Shop) Discount",
    "Sole Retreat Discount (60-Minute Treatment)",
    "Retreat Spa Discount (60 to 120-Minute Treatments)",
    "Beauty Salon and Barbershop Discount",
    "Spa Boutique Discount for Regular-priced Items",
    "Thrillscape Discount",
    "Thrillscape Discount on Select Merchandise",
    "Discount on Okada Kids Club Access",
    "Discount on Okada Kids Club Merchandise",
    "Complimentary Haircut at Retreat Spa – Salon (During Your Birth Month)"
   ],
   "Dining": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "Dining Discount – Medley⁵",
    "Dining Discount – Lobby Lounge⁵",
    "Dining Discount – Pool Bar⁵",
    "Dining Discount – Goryeo Korean Dining⁵",
    "Dining Discount – Enbu⁵",
    "Dining Discount – La Piazza⁵",
    "Dining Discount – Red Spice⁵",
    "Dining Discount – Kiapo⁵",
    "Dining Discount – Perlas Dining⁵",
    "Dining Discount – Okada Dining⁵",
    "Dining Discount – Okada Lounge⁵",
    "Dining Discount – The Coral Lounge⁵",
    "Dining Discount – Roasting by Red Spice⁵",
    "Dining Discount – Ryuchi Ramen⁵",
    "Dining Discount – Curry Corner⁵",
    "Special Birthday Surprise in La Piazza",
    "Discount Applicable Even on Blackout Dates",
    "Specialty Dining Discount – Kappou Yoshi⁵"
   ],
   "Retail": [
    "Earn and Redeem Rewards",
    "Earn Lifestyle Points on Cash/Credit Card Payment³",
    "The Gift Boutique Discount",
    "Member-exclusive Promotions at Selected Outlets"
   ]
  }
 }
];
const RC_NOTES = [
 "¹ Based on gaming.",
 "² Subject to availability.",
 "³ Based on amount exclusive of taxes and service charge at selected outlets.",
 "⁴ Up to 2 pieces for Supreme and 5 pieces for Maharlika.",
 "⁵ The beverage discount applies only to non-alcoholic drinks. All dining discounts are applicable to food only and for a limited number of persons.",
 "Terms and conditions apply to all benefits. All benefits are subject to change without prior notice."
];
const rcTier = name => RC_TIERS.find(t => t.name === name) || RC_TIERS[0];
const rcNext = name => RC_TIERS[RC_TIERS.indexOf(rcTier(name)) + 1] || null;

function rcTiersSection(guest = !(S.login && ME.om)) {
  const cur = guest ? null : rcTier(ME.tier), sel = rcTier(S.rctier || (cur ? cur.name : RC_TIERS[0].name));
  const cards = RC_TIERS.map(t => `
    <button type="button" class="ooc-rct${t === sel ? ' is-sel' : ''}${t === cur ? ' is-cur' : ''}" data-rctier="${t.name}" aria-pressed="${t === sel}">
      <span class="ooc-rct-img"><img src="${t.img}" alt="${t.name} card" loading="lazy"></span>
      <b>${t.name}</b><small>${esc(t.req)}</small><small>${esc(t.conv)}</small>${t === cur ? '<i>Your Tier</i>' : ''}
    </button>`).join('');
  const cats = Object.entries(sel.cats).map(([c, items], i) => `
    <details class="ooc-rcb"${i === 0 ? ' open' : ''}><summary><b>${esc(c)}</b><span>${items.length}</span></summary>
      <ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>`).join('');
  const nx = cur && rcNext(cur.name);
  return section('Membership Tiers', `
    <div class="ooc-rct-row" role="group" aria-label="Membership tiers">${cards}</div>
    ${nx ? `<p class="ooc-rct-up">${fmt(Math.max(0, nx.min - ME.tierPts))} Tier Points to ${nx.name}</p>` : ''}`)
    + section(`${sel.name} Benefits`, `<div class="ooc-rcb-list">${cats}</div>
    <ul class="ooc-rcb-notes">${RC_NOTES.map(n => `<li>${esc(n)}</li>`).join('')}</ul>`);
}
