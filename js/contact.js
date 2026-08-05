(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var nameInput = form.querySelector('#name');
    var emailInput = form.querySelector('#email');
    var messageInput = form.querySelector('#message');
    var name = (nameInput && nameInput.value || '').trim();
    var email = (emailInput && emailInput.value || '').trim();
    var message = (messageInput && messageInput.value || '').trim();

    if (!name || !email || !message) {
      window.alert('Please fill in your name, email, and message.');
      return;
    }

    var subject = 'Portfolio message from ' + name;
    var body = [
      'Name: ' + name,
      'Email: ' + email,
      '',
      message
    ].join('\n');

    var mailto =
      'mailto:slzhou@stanford.edu' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailto;
  });
})();
