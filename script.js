/* ============================================================
   script.js – JavaScript für die Artefix Bobo Bau GmbH Website
   
   Dieses Script steuert:
   1. Die Navigation (Hintergrund beim Scrollen)
   2. Das Hamburger-Menü auf Mobilgeräten
   3. Die Scroll-Animationen (Elemente erscheinen beim Scrollen)
   4. Das Formular (Absende-Bestätigung)
   ============================================================ */

/* --- Warten bis die Seite geladen ist --- */
document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. NAVIGATION – Hintergrund ändern beim Scrollen
     Wenn der Benutzer nach unten scrollt, bekommt die Navigation
     einen weissen Hintergrund und einen Schatten.
     ============================================================ */
  const navbar = document.querySelector('.navbar');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* Beim Laden und beim Scrollen prüfen */
  handleScroll();
  window.addEventListener('scroll', handleScroll);


  /* ============================================================
     2. HAMBURGER-MENÜ – Das mobile Menü öffnen und schliessen
     Wenn man auf den Hamburger-Button klickt, fährt das Menü
     von oben rein. Ein zweiter Klick schliesst es wieder.
     ============================================================ */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    /* Hamburger-Button klicken → Menü auf/zu */
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      /* Scrollen verhindern wenn Menü offen ist */
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    /* Wenn ein Link im mobilen Menü geklickt wird → Menü schliessen */
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* ============================================================
     3. SCROLL-ANIMATIONEN – Elemente erscheinen beim Scrollen
     Alle Elemente mit der Klasse "fade-in" werden unsichtbar
     geladen und erscheinen sanft, sobald sie im Sichtbereich sind.
     ============================================================ */
  const fadeElements = document.querySelectorAll('.fade-in');

  /* IntersectionObserver beobachtet, wann ein Element sichtbar wird */
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        /* Einmal animiert → nicht mehr beobachten */
        observer.unobserve(entry.target);
      }
    });
  }, {
    /* Element wird animiert, wenn 15% davon sichtbar sind */
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  /* Alle fade-in Elemente beobachten */
  fadeElements.forEach(function (el) {
    observer.observe(el);
  });


  /* ============================================================
     4. FORMULAR – Senden per AJAX an Formspree (ohne Weiterleitung)
     Das Formular wird im Hintergrund an Formspree gesendet. Der
     Besucher bleibt auf der Seite und sieht die Bestätigung direkt
     an der Stelle, wo vorher das Formular war.
     ============================================================ */
  const forms = document.querySelectorAll('.form-card form[action*="formspree.io"]');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formCard = form.closest('.form-card');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Button während des Sendens deaktivieren
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.textContent = 'Wird gesendet…';
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            // Erfolgsmeldung direkt anstelle des Formulars anzeigen
            formCard.innerHTML = `
              <div style="text-align:center; padding: 3rem 1rem;">
                <svg viewBox="0 0 24 24" width="60" height="60" style="stroke:#4a7c59;fill:none;stroke-width:2;margin-bottom:1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h3 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:1rem;">Vielen Dank.</h3>
                <p style="color:var(--text-body);">Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns so schnell wie möglich.</p>
                <a href="index.html" class="btn btn-dark" style="margin-top:2rem;display:inline-flex;">Zurück zur Startseite</a>
              </div>
            `;
            formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            throw new Error('Formspree-Fehler');
          }
        })
        .catch(function () {
          // Fehlermeldung anzeigen, Formular bleibt erhalten
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.textContent = 'Erneut senden';
          }
          let errorNote = form.querySelector('.form-error-note');
          if (!errorNote) {
            errorNote = document.createElement('p');
            errorNote.className = 'form-note form-error-note';
            errorNote.style.color = '#b3403e';
            form.appendChild(errorNote);
          }
          errorNote.textContent = 'Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@artefix-bobo.ch.';
        });
    });
  });


  /* ============================================================
     5. AKTIVE NAVIGATION – Den aktuellen Link hervorheben
     Der Link der aktuellen Seite bekommt die Klasse "active".
     ============================================================ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
