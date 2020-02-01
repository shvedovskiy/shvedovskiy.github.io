'use strict';

(function () {
  document.body.addEventListener('click', copyText, true);

  function copyText(event) {
    var targetElement = event.target;
    var copyTarget = targetElement.dataset.copytarget;
    var inputElement = (copyTarget ? document.querySelector(copyTarget) : null);
    if (inputElement && inputElement.select) {
      inputElement.select();
      try {
        document.execCommand('copy');
        inputElement.blur();
        targetElement.classList.add('copied');
        setTimeout(function () {
          targetElement.classList.remove('copied');
        }, 500);
      } catch (err) {
        alert('Нажмите Ctrl/Cmd+C для копирования текста в буфер обмена');
      }
    }
  }
})();