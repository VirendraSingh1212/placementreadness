const copyButton = document.getElementById("copy-prompt");
const promptBox = document.getElementById("prompt-box");

if (copyButton && promptBox) {
  copyButton.addEventListener("click", async () => {
    const original = copyButton.textContent;
    try {
      await navigator.clipboard.writeText(promptBox.value);
      copyButton.textContent = "Copied";
    } catch (_error) {
      copyButton.textContent = "Copy Failed";
    }
    window.setTimeout(() => {
      copyButton.textContent = original;
    }, 1200);
  });
}

const proofCheckboxes = document.querySelectorAll("input[type='checkbox'][data-proof]");

proofCheckboxes.forEach((checkbox) => {
  const proofId = checkbox.getAttribute("data-proof");
  if (!proofId) {
    return;
  }

  const proofInput = document.getElementById(proofId);
  if (!proofInput) {
    return;
  }

  const syncProofState = () => {
    const hasProof = proofInput.value.trim().length > 0;
    checkbox.disabled = !hasProof;
    if (!hasProof) {
      checkbox.checked = false;
    }
  };

  syncProofState();
  proofInput.addEventListener("input", syncProofState);
});
