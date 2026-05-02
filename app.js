const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const amountInput = document.getElementById("amount");
const submitBtn = document.getElementById("submitBtn");

const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
const amountError = document.getElementById("amountError");

const form = document.getElementById("paymentForm");

// =======================
// DARK / LIGHT MODE
// =======================
const toggleBtn = document.getElementById("toggleTheme");

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    // ❌ AVANT : light
    // ✅ APRÈS : dark
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      toggleBtn.textContent = "☀️ Mode clair";
    } else {
      toggleBtn.textContent = "🌙 Mode sombre";
    }
  });
}

// =======================
// VALIDATION RULES
// =======================
const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;

// 🔥 FIX IMPORTANT ICI
const phoneRegex = /^\+?[0-9\s]{8,20}$/;

// =======================
// FORM VALIDATION
// =======================
function validateForm() {
  let isValid = true;

  // NAME
  if (!nameRegex.test(nameInput.value.trim())) {
    nameError.textContent = "Nom invalide";
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  // PHONE
  if (!phoneRegex.test(phoneInput.value.trim())) {
    phoneError.textContent = "Téléphone invalide";
    isValid = false;
  } else {
    phoneError.textContent = "";
  }

  // AMOUNT
  const amount = Number(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    amountError.textContent = "Montant invalide";
    isValid = false;
  } else {
    amountError.textContent = "";
  }

  submitBtn.disabled = !isValid;
}

// live validation
nameInput.addEventListener("input", validateForm);
phoneInput.addEventListener("input", validateForm);
amountInput.addEventListener("input", validateForm);

// =======================
// RESET BUTTON
// =======================
function resetButton() {
  submitBtn.innerText = "Continuer le paiement →";
  submitBtn.disabled = false;
}

// =======================
// SUBMIT PAYMENT
// =======================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.innerText = "Redirection...";
  submitBtn.disabled = true;

  try {
    const res = await fetch("https://kdp-backend-sbd9.onrender.com/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        amount: Number(amountInput.value)
      })
    });

    if (!res.ok) {
      throw new Error("Erreur serveur");
    }

    const data = await res.json();

    if (data.payment_url) {
      window.location.href = data.payment_url;
    } else {
      throw new Error("URL de paiement manquante");
    }

  } catch (error) {
    console.error(error);
    submitBtn.innerText = "Erreur réseau";
    setTimeout(resetButton, 2000);
  }
});
