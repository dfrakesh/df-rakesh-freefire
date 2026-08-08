const SUPABASE_URL = "https://siipvlsrvdwkivpfxtkq.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_6D0gwy4V3wbzpclceVZMxA_YHbVHdaV";

let accessToken = null;

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("loginStatus");

  status.textContent = "Logging in...";

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    status.textContent =
      data.error_description || "Login failed";
    return;
  }

  accessToken = data.access_token;

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("panel").style.display = "block";

  loadSettings();
}

async function loadSettings() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/site_settings?select=*`,
    {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    document.getElementById("saveStatus").textContent =
      "Could not load settings";
    return;
  }

  data.forEach(item => {
    const element = document.getElementById(item.setting_name);

    if (element) {
      element.value = item.setting_value || "";
    }
  });
}

async function saveSettings() {
  const status = document.getElementById("saveStatus");

  status.textContent = "Saving...";

  const fields = [
    "registration_link",
    "prize_pool",
    "mode",
    "tournament_date",
    "registration_status",
    "entry_fee",
    "room_info",
    "qr_url"
  ];

  for (const field of fields) {
    const value = document.getElementById(field).value;

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?setting_name=eq.${field}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${accessToken}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          setting_value: value
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();

      status.textContent =
        "Error saving " + field + ": " + error;

      return;
    }
  }

  status.textContent =
    "Changes saved successfully!";
}

async function logout() {
  if (accessToken) {
    await fetch(
      `${SUPABASE_URL}/auth/v1/logout`,
      {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );
  }

  accessToken = null;

  document.getElementById("panel").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
}
