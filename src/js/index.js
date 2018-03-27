'use strict';

(function () {
  document.body.addEventListener('click', copy, true);

  function copy(e) {
    var t = e.target,
      c = t.dataset.copytarget,
      inp = (c ? document.querySelector(c) : null);
    if (inp && inp.select) {
      inp.select();
      try {
        document.execCommand('copy');
        inp.blur();
        t.classList.add('copied');
        setTimeout(function () {
          t.classList.remove('copied');
        }, 500);
      } catch (err) {
        alert('Нажмите Ctrl/Cmd+C для копирования текста в буфер обмена');
      }
    }
  }
})();