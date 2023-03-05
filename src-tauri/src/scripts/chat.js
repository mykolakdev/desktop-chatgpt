async function init() {
  new MutationObserver(function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.target.closest("form")) {
        chatBtns();
      }
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function chatBtns() {
  Array.from(document.querySelectorAll("main >div>div>div>div>div"))
    .forEach(i => {
      if (i.querySelector('.chat-item-copy')) return;
      if (!i.querySelector('button.rounded-md')) return;
      const cpbtn = i.querySelector('button.rounded-md').cloneNode(true);
      cpbtn.classList.add('chat-item-copy');
      cpbtn.title = 'Copy to clipboard';
      cpbtn.innerHTML = setIcon('copy');
      i.querySelector('.self-end').appendChild(cpbtn);
      cpbtn.onclick = () => {
        copyToClipboard(i?.innerText?.trim() || '', cpbtn);
      }

      const saybtn = i.querySelector('button.rounded-md').cloneNode(true);
      saybtn.classList.add('chat-item-voice');
      saybtn.title = 'Say';
      saybtn.innerHTML = setIcon('voice');
      i.querySelector('.self-end').appendChild(saybtn);
      let amISpeaking = null;
      const synth = window.speechSynthesis;
      saybtn.onclick = () => {
        const txt = i?.innerText?.trim() || '';
        const lang = 'en-US';
        if (!txt) return;
        if (amISpeaking) {
          amISpeaking = null;
          synth.cancel();
          saybtn.innerHTML = setIcon('voice');
          return;
        }
        const utterance = new SpeechSynthesisUtterance(txt);
        utterance.lang = lang;
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === lang);
        synth.speak(utterance);
        amISpeaking = synth.speaking;
        saybtn.innerHTML = setIcon('speaking');
        utterance.addEventListener('end', () => {
          saybtn.innerHTML = setIcon('voice');
        });
      }
    })
}

function copyToClipboard(text, btn) {
  window.clearTimeout(window.__cpTimeout);
  btn.innerHTML = setIcon('cpok');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.style.top = '10px';
    textarea.value = text;
    textarea.select();
    document.execCommand('copy', true);
    document.body.removeChild(textarea);
  }
  window.__cpTimeout = setTimeout(() => {
    btn.innerHTML = setIcon('copy');
  }, 1000);
}

function setIcon(type) {
  return {
    copy: `<svg class="chatappico copy" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
    cpok: `<svg class="chatappico cpok" viewBox="0 0 24 24"><g fill="none" stroke="#10a37f" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 4h2a2 2 0 0 1 2 2v4m1 4H11"/><path d="m15 10l-4 4l4 4"/></g></svg>`,
    voice: `<svg class="chatappico voice" viewBox="0 0 1024 1024"><path d="M542.923802 202.113207c-5.110391 0-10.717086 1.186012-16.572444 3.739161L360.043634 312.714188l-83.057671 0c-46.109154 0-83.433224 36.917818-83.433224 83.121116l0 166.646438c0 45.952588 36.950564 83.153862 83.433224 83.153862l83.057671 0 166.307723 106.829074c23.550369 10.218736 41.745776-0.717338 41.745776-23.898293L568.097134 229.687216C568.096111 212.426087 557.753555 202.113207 542.923802 202.113207z" fill="currentColor"></path><path d="M794.154683 314.39548c-16.758686-28.537963-33.771151-48.258097-45.610804-58.882062-3.986801-3.489474-8.972349-5.233188-13.833053-5.233188-5.79396 0-11.464099 2.337231-15.57779 6.91448-7.662517 8.631588-6.976902 21.808702 1.620917 29.410843 1.994424 1.744737 5.856381 5.700839 11.154038 11.777231 9.033747 10.437723 18.006096 22.774703 26.419719 37.072337 24.235984 41.033555 38.755676 89.011266 38.755676 143.688563 0 54.705949-14.519692 102.651938-38.755676 143.810337-8.414647 14.20656-17.448394 26.668383-26.484188 37.07336-5.234211 6.076392-9.096169 10.033517-11.149944 11.778254-8.538467 7.603165-9.224082 20.717857-1.683339 29.40982 7.599072 8.473999 20.807908 9.222035 29.40982 1.650593 11.900028-10.562567 28.910447-30.252001 45.732577-58.850339 27.79095-47.078225 44.490284-102.3122 44.490284-164.872025C838.708412 416.646282 821.946656 361.470635 794.154683 314.39548z" fill="currentColor"></path><path d="M690.846806 377.360534c-8.723685-17.790178-17.698081-30.2827-24.301476-37.260625-4.111644-4.3951-9.595542-6.544043-15.139815-6.544043-5.110391 0-10.159384 1.774413-14.270005 5.54632-8.350179 7.881504-8.847505 20.99722-0.997724 29.471219 3.927449 4.112668 10.468422 13.304004 17.448394 27.199479 11.587919 23.77038 18.567891 51.559283 18.567891 83.370803 0 31.80845-6.978948 59.72322-18.567891 83.400478-6.978948 13.892405-13.520945 23.052019-17.448394 27.259854-7.850805 8.410554-7.353478 21.559015 0.997724 29.440519 8.473999 7.882528 21.559015 7.353478 29.474288-1.025353 6.53995-7.011694 15.513322-19.440771 24.238031-37.356816 14.393825-29.189809 22.992667-63.243393 22.992667-101.781104C713.839473 440.603927 705.241654 406.583089 690.846806 377.360534z" fill="currentColor"></path></svg>`,
    speaking: `<svg class="chatappico voice" viewBox="0 0 1024 1024"><path d="M542.923802 202.113207c-5.110391 0-10.717086 1.186012-16.572444 3.739161L360.043634 312.714188l-83.057671 0c-46.109154 0-83.433224 36.917818-83.433224 83.121116l0 166.646438c0 45.952588 36.950564 83.153862 83.433224 83.153862l83.057671 0 166.307723 106.829074c23.550369 10.218736 41.745776-0.717338 41.745776-23.898293L568.097134 229.687216C568.096111 212.426087 557.753555 202.113207 542.923802 202.113207z" fill="#10a37f"></path><path d="M794.154683 314.39548c-16.758686-28.537963-33.771151-48.258097-45.610804-58.882062-3.986801-3.489474-8.972349-5.233188-13.833053-5.233188-5.79396 0-11.464099 2.337231-15.57779 6.91448-7.662517 8.631588-6.976902 21.808702 1.620917 29.410843 1.994424 1.744737 5.856381 5.700839 11.154038 11.777231 9.033747 10.437723 18.006096 22.774703 26.419719 37.072337 24.235984 41.033555 38.755676 89.011266 38.755676 143.688563 0 54.705949-14.519692 102.651938-38.755676 143.810337-8.414647 14.20656-17.448394 26.668383-26.484188 37.07336-5.234211 6.076392-9.096169 10.033517-11.149944 11.778254-8.538467 7.603165-9.224082 20.717857-1.683339 29.40982 7.599072 8.473999 20.807908 9.222035 29.40982 1.650593 11.900028-10.562567 28.910447-30.252001 45.732577-58.850339 27.79095-47.078225 44.490284-102.3122 44.490284-164.872025C838.708412 416.646282 821.946656 361.470635 794.154683 314.39548z" fill="#10a37f"></path><path d="M690.846806 377.360534c-8.723685-17.790178-17.698081-30.2827-24.301476-37.260625-4.111644-4.3951-9.595542-6.544043-15.139815-6.544043-5.110391 0-10.159384 1.774413-14.270005 5.54632-8.350179 7.881504-8.847505 20.99722-0.997724 29.471219 3.927449 4.112668 10.468422 13.304004 17.448394 27.199479 11.587919 23.77038 18.567891 51.559283 18.567891 83.370803 0 31.80845-6.978948 59.72322-18.567891 83.400478-6.978948 13.892405-13.520945 23.052019-17.448394 27.259854-7.850805 8.410554-7.353478 21.559015 0.997724 29.440519 8.473999 7.882528 21.559015 7.353478 29.474288-1.025353 6.53995-7.011694 15.513322-19.440771 24.238031-37.356816 14.393825-29.189809 22.992667-63.243393 22.992667-101.781104C713.839473 440.603927 705.241654 406.583089 690.846806 377.360534z" fill="#10a37f"></path></svg>`,
  }[type];
}

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}