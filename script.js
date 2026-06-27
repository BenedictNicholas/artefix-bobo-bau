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
     4. FORMULAR – Absende-Bestätigung anzeigen
     Da es kein Backend gibt, zeigen wir eine Bestätigung an,
     wenn das Formular abgeschickt wird.
     ============================================================ */
  const forms = document.querySelectorAll('form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      /* Normales Absenden verhindern (es gibt kein Backend) */
      e.preventDefault();

      /* Button-Text ändern als Bestätigung */
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '✓ Gesendet – Vielen Dank!';
      submitBtn.style.background = '#4a7c59';
      submitBtn.style.color = '#fff';
      submitBtn.disabled = true;

      /* Nach 3 Sekunden zurücksetzen */
      setTimeout(function () {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
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
