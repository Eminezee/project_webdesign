document.addEventListener('DOMContentLoaded', () => {
  const money = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  document.querySelectorAll('.book-btn').forEach(btn => btn.addEventListener('click', () => {
    localStorage.setItem('lumiereSelectedRoom', btn.dataset.room || 'Deluxe Room');
    localStorage.setItem('lumiereSelectedPrice', btn.dataset.price || '650000');
    location.href = 'booking.html';
  }));
  const form = document.getElementById('bookingForm');
  if (!form) return;
  const room = document.getElementById('roomType');
  const ci = document.getElementById('checkin');
  const co = document.getElementById('checkout');
  const total = document.getElementById('bookingTotal');
  const feedback = document.getElementById('bookingFeedback');
  const iso = d => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0,10); };
  const today = iso(new Date()); ci.min = today; co.min = today;
  const selected = localStorage.getItem('lumiereSelectedRoom');
  if (selected) { for (const o of room.options) if (o.value === selected) room.value = selected; localStorage.removeItem('lumiereSelectedRoom'); }
  localStorage.removeItem('lumiereSelectedPrice');
  function calc() {
    const price = Number(room.selectedOptions[0].dataset.price || 350000);
    let nights = 1;
    if (ci.value && co.value) { const diff = Math.ceil((new Date(co.value) - new Date(ci.value)) / 86400000); if (diff > 0) nights = diff; }
    total.textContent = money(price * nights);
    return { price, nights, total: price * nights };
  }
  [room, ci, co].forEach(el => el.addEventListener('change', () => { if (ci.value) { co.min = ci.value; if (co.value && co.value <= ci.value) co.value = ''; } calc(); }));
  calc();
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!ci.value || !co.value || co.value <= ci.value) { alert('Tanggal check-out harus setelah tanggal check-in.'); return; }
    const c = calc();
    const booking = { name: document.getElementById('guestName').value, email: document.getElementById('guestEmail').value, room: room.value, checkin: ci.value, checkout: co.value, nights: c.nights, total: c.total };
    localStorage.setItem('lumiereBooking', JSON.stringify(booking));
    feedback.classList.remove('d-none');
    feedback.innerHTML = `<strong>Pemesanan demo tercatat!</strong><br>${booking.name}, ${booking.room} selama ${booking.nights} malam. Estimasi total: <strong>${money(booking.total)}</strong>. Tahap pembayaran akan ditambahkan pada pengembangan berikutnya.`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
