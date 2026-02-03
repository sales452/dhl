/* =====================================================================
   1. FULL COUNTRY LIST (UI ONLY – ISO 3166, 240+ COUNTRIES)
   ===================================================================== */
const allCountries = [
  "Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola",
  "Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba",
  "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados",
  "Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia",
  "Bosnia and Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei",
  "Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde",
  "Cayman Islands","Central African Republic","Chad","Chile","China","Colombia",
  "Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
  "Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France","French Guiana","Gabon","Gambia","Georgia","Germany",
  "Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guatemala",
  "Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait",
  "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya",
  "Liechtenstein","Lithuania","Luxembourg","Macau","Madagascar","Malawi",
  "Malaysia","Maldives","Mali","Malta","Martinique","Mauritania","Mauritius",
  "Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco",
  "Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Caledonia",
  "New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman",
  "Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines",
  "Poland","Portugal","Puerto Rico","Qatar","Romania","Russia","Rwanda",
  "Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea",
  "Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan",
  "Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago",
  "Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela",
  "Vietnam","Yemen","Zambia","Zimbabwe"
];

/* =====================================================================
   2. SEARCHABLE DROPDOWN (MOBILE + DESKTOP SAFE)
   ===================================================================== */
const input = document.getElementById("countryInput");
const dropdown = document.getElementById("countryDropdown");

input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  dropdown.innerHTML = "";

  if (!value) return;

  allCountries
    .filter(country => country.toLowerCase().includes(value))
    .slice(0, 30) // limit for performance
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

/* Close dropdown when clicking outside */
document.addEventListener("click", (e) => {
  if (!e.target.closest("#countryInput")) {
    dropdown.innerHTML = "";
  }
});

/* =====================================================================
   3. FREIGHT CALCULATION (DHL LOGIC)
   ===================================================================== */
function calculateFreight() {
  const country = input.value.trim();
  const kg = parseFloat(document.getElementById("kg").value);
  const zone = countryZoneMap[country];

  if (!kg || kg <= 0) {
    alert("Please enter valid weight");
    return;
  }

  if (!zone) {
    alert("DHL pricing not configured for this country yet");
    return;
  }

  let base = 0;
  const slabs = Object.keys(dhlRates.slabs)
    .map(Number)
    .sort((a, b) => a - b);

  if (kg <= 30) {
    const slab = slabs.find(s => kg <= s);
    base = dhlRates.slabs[slab][zone];
  } else {
    base = dhlRates.slabs[30][zone];
    const extraKg = kg - 30;

    const rate =
      kg <= 70
        ? dhlRates.multiplier.upto70[zone]
        : kg <= 300
        ? dhlRates.multiplier.upto300[zone]
        : dhlRates.multiplier.above300[zone];

    base += extraKg * rate;
  }

  const fuel = base * dhlRates.charges.fuel;
  const gst = (base + fuel) * dhlRates.charges.gst;
  const total = base + fuel + gst + dhlRates.charges.clearance;

  document.getElementById("result").innerHTML = `
    <b>Country:</b> ${country}<br>
    <b>Zone:</b> ${zone}<br>
    <b>Weight:</b> ${kg} KG<br>
    <b>DHL Base:</b> ₹${base.toFixed(2)}
    <hr>
    <b>Total (INR):</b> ₹${total.toFixed(2)}<br>
    <b>Total (USD):</b> $${(total / 83).toFixed(2)}<br>
    <b>Total (EUR):</b> €${(total / 90).toFixed(2)}
  `;
}
