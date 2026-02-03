/* ===================== 1. FULL COUNTRY LIST (UI ONLY) ===================== */
const allCountries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium",
  "Belize","Benin","Bolivia","Bosnia and Herzegovina","Botswana","Brazil",
  "Brunei","Bulgaria","Cambodia","Cameroon","Canada","Chile","China","Colombia",
  "Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Finland","France","Georgia",
  "Germany","Ghana","Greece","Guatemala","Honduras","Hong Kong","Hungary","Iceland",
  "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
  "Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon","Lithuania","Luxembourg",
  "Malaysia","Maldives","Mexico","Mongolia","Morocco","Myanmar","Nepal",
  "Netherlands","New Zealand","Nigeria","Norway","Oman","Pakistan","Panama",
  "Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia",
  "Saudi Arabia","Singapore","Slovakia","Slovenia","South Africa","South Korea",
  "Spain","Sri Lanka","Sweden","Switzerland","Taiwan","Thailand","Tunisia",
  "Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Vietnam","Yemen","Zambia","Zimbabwe"
];

/* ===================== 2. SEARCHABLE DROPDOWN ===================== */
const input = document.getElementById("countryInput");
const dropdown = document.getElementById("countryDropdown");

input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  dropdown.innerHTML = "";

  if (!value) return;

  allCountries
    .filter(c => c.toLowerCase().includes(value))
    .slice(0, 30)
    .forEach(country => {
      const div = document.createElement("div");
      div.textContent = country;
      div.onclick = () => {
        input.value = country;
        dropdown.innerHTML = "";
      };
      dropdown.appendChild(div);
    });
});

/* ===================== 3. CALCULATION ===================== */
function calculateFreight() {
  const country = input.value.trim();
  const kg = parseFloat(document.getElementById("kg").value);
  const zone = countryZoneMap[country];

  if (!kg) {
    alert("Please enter weight");
    return;
  }

  if (!zone) {
    alert("DHL pricing not configured for this country yet");
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
    const rate =
      kg <= 70 ? dhlRates.multiplier.upto70[zone]
      : kg <= 300 ? dhlRates.multiplier.upto300[zone]
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
    <b>Total (USD):</b> $${(total / 83).toFixed(2)}<br>
    <b>Total (EUR):</b> €${(total / 90).toFixed(2)}
  `;
}
