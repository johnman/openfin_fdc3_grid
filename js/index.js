const init = async () => {
  if (window.fin) {
    const runtimeVersion = await window.fin.System.getVersion();
    console.log("Openfin Runtime version: " + runtimeVersion);
  } else {
  }
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
