const $ = (id) => document.getElementById(id);

const ownGoldCheckbox = $("own-gold");
const goldCreditRow = $("gold-credit-row");
const goldCreditLine = $("s-gold-credit-line");

function money(value) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function setupItemList(listId, addBtnId, rowClass, placeholder) {
  const list = $(listId);
  const addBtn = $(addBtnId);

  function addRow(name = "", cost = "") {
    const row = document.createElement("div");
    row.className = "stone-row";
    row.innerHTML = `
      <input type="text" class="${rowClass}-name" placeholder="${placeholder}" value="${name}" />
      <input type="number" class="${rowClass}-cost" placeholder="Cost" value="${cost}" />
      <button type="button" title="Remove">&times;</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      row.remove();
      calculate();
    });
    row.querySelectorAll("input").forEach((input) =>
      input.addEventListener("input", calculate)
    );
    list.appendChild(row);
  }

  addBtn.addEventListener("click", () => addRow());

  function total() {
    let sum = 0;
    document.querySelectorAll(`.${rowClass}-cost`).forEach((input) => {
      sum += parseFloat(input.value) || 0;
    });
    return sum;
  }

  return { addRow, total };
}

const stones = setupItemList("stones-list", "add-stone", "stone", "e.g. Sapphire");
const chain = setupItemList("chain-list", "add-chain", "chain", "e.g. 18k Cable Chain");

function calculate() {
  const printing = parseFloat($("printing").value) || 0;
  const material = parseFloat($("material").value) || 0;
  const outsideLabor = parseFloat($("outside-labor").value) || 0;

  const designHours = parseFloat($("design-hours").value) || 0;
  const designRate = parseFloat($("design-rate").value) || 0;
  const designLaborTotal = designHours * designRate;
  $("design-labor-total").textContent = money(designLaborTotal);

  const logisticsHours = parseFloat($("logistics-hours").value) || 0;
  const logisticsRate = parseFloat($("logistics-rate").value) || 0;
  const logisticsLaborTotal = logisticsHours * logisticsRate;
  $("logistics-labor-total").textContent = money(logisticsLaborTotal);

  const totalCost =
    printing + material + outsideLabor + designLaborTotal + logisticsLaborTotal;
  $("total-cost").textContent = money(totalCost);

  const stonesSum = stones.total();
  $("stones-total").textContent = money(stonesSum);

  const chainSum = chain.total();
  $("chain-total").textContent = money(chainSum);

  const overheadPct = parseFloat($("overhead-pct").value) || 0;
  const markupPct = parseFloat($("markup-pct").value) || 0;
  const overhead = totalCost * (overheadPct / 100);
  const markup = totalCost * (markupPct / 100);

  const shipping = parseFloat($("shipping").value) || 0;

  const goldCreditVisible = ownGoldCheckbox.checked;
  goldCreditRow.style.display = goldCreditVisible ? "" : "none";
  goldCreditLine.style.display = goldCreditVisible ? "" : "none";
  const goldCredit = goldCreditVisible ? parseFloat($("gold-credit").value) || 0 : 0;

  const finalPrice =
    totalCost + stonesSum + chainSum + overhead + markup + shipping - goldCredit;

  $("s-total-cost").textContent = money(totalCost);
  $("s-stones").textContent = money(stonesSum);
  $("s-chain").textContent = money(chainSum);
  $("s-overhead").textContent = money(overhead);
  $("s-markup").textContent = money(markup);
  $("s-shipping").textContent = money(shipping);
  $("s-gold-credit").textContent = `-${money(goldCredit)}`;
  $("s-final").textContent = money(finalPrice);
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", calculate);
});

stones.addRow("Sapphire", 2000);
calculate();
