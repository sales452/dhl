const allCountries = Object.keys(countryZoneMap);

const input = document.getElementById("countryInput");
const dropdown = document.getElementById("countryDropdown");

input.addEventListener("input", () => {
  const val = input.value.toLowerCase();
  dropdown.innerHTML = "";

  allCountries
    .filter(c => c.toLowerCase().includes(val))
    .slice(0, 30)
    .forEach(c => {
      const div = document.createElement("div");
      div.textContent = c;
      div.onclick = () => {
        input.value = c;
        dropdown.innerHTML = "";
      };
      dropdown.appendChild(div);
    });
});

function calculateFreight() {
  const country = input.value.trim();
  const kg = parseFloat(document.getElementById("kg").value);
  const zone = countryZoneMap[country];

  if (!zone || !kg) {
    alert("Invalid country or weight");
    return;
  }

  let base = 0;
  const slabs = Object.keys(dhlRates.slabs).map(Number).sort((a,b)=>a-b);

  if (kg <= 30) {
    const slab = slabs.find(s => kg <= s);
    base = dhlRates.slabs[slab][zone];
  } else {
    base = dhlRates.slabs[30][zone];
    const extra = kg - 30;
    const rate = kg <= 70
      ? dhlRates.multiplier.upto70[zone]
      : kg <= 300
      ? dhlRates.multiplier.upto300[zone]
      : dhlRates.multiplier.above300[zone];
    base += extra * rate;
  }

  const fuel = base * dhlRates.charges.fuel;
  const gst = (base + fuel) * dhlRates.charges.gst;
  const total = base + fuel + gst + dhlRates.charges.clearance;

  document.getElementById("result").innerHTML = `
    <b>Country:</b> ${country}<br>
    <b>Zone:</b> ${zone}<br>
    <b>Weight:</b> ${kg} KG<br>
    <b>DHL Base:</b> ₹${base.toFixed(2)}<hr>
    <b>Total (INR):</b> ₹${total.toFixed(2)}<br>
    <b>Total (USD):</b> $${(total/83).toFixed(2)}<br>
    <b>Total (EUR):</b> €${(total/90).toFixed(2)}
  `;
}
