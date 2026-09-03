(function () {
  var PIN = '7391';

  if (sessionStorage.getItem('siteUnlocked') === '1') {
    return;
  }

  var gate = document.getElementById('siteGate');

  if (!gate) {
    window.location.replace('index.html');
    return;
  }

  gate.style.display = 'flex';

  var form = document.getElementById('siteGateForm');
  var input = document.getElementById('siteGatePin');
  var error = document.getElementById('siteGateError');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value.trim() === PIN) {
      sessionStorage.setItem('siteUnlocked', '1');
      gate.style.display = 'none';
    } else {
      error.textContent = 'Falscher Code, bitte nochmal.';
      input.value = '';
      input.focus();
    }
  });
})();
