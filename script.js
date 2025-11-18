// Load saved CRT preference
const crtSwitch = document.getElementById("crtSwitch");
const savedCrtState = localStorage.getItem("crtMode") === "true";

if (crtSwitch) {
  // Apply saved state on page load
  crtSwitch.checked = savedCrtState;
  document.body.classList.toggle("crt-on", savedCrtState);
  document.body.classList.toggle("crt-off", !savedCrtState);

  // Save state when changed
  crtSwitch.addEventListener("change", e => {
    const isOn = e.target.checked;
    document.body.classList.toggle("crt-on", isOn);
    document.body.classList.toggle("crt-off", !isOn);
    localStorage.setItem("crtMode", isOn);
  });
}
