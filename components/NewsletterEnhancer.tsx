'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(form: HTMLFormElement, message: string, type: 'success' | 'error') {
  const existing = Array.from(form.querySelectorAll<HTMLElement>('.form-message'));
  for (const el of existing) el.remove();

  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message--${type}`;
  messageEl.textContent = message;
  messageEl.style.padding = 'var(--spacing-md)';
  messageEl.style.marginTop = 'var(--spacing-md)';
  messageEl.style.borderRadius = 'var(--border-radius)';
  messageEl.style.fontWeight = 'var(--font-weight-medium)';

  if (type === 'success') {
    messageEl.style.backgroundColor = 'var(--color-success)';
    messageEl.style.color = 'white';
  } else {
    messageEl.style.backgroundColor = 'var(--color-error)';
    messageEl.style.color = 'white';
  }

  form.appendChild(messageEl);

  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}

export function NewsletterEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const form = document.getElementById('newsletter-form') as HTMLFormElement | null;
    if (!form) return;
    const formEl = form;

    function onSubmit(event: Event) {
      event.preventDefault();

      const formData = new FormData(formEl);
      const email = String(formData.get('email') ?? '').trim();
      const website = String(formData.get('website') ?? '').trim();

      // Honeypot: ignore spam silently.
      if (website) {
        formEl.reset();
        showFormMessage(formEl, 'Thank you for subscribing!', 'success');
        return;
      }

      if (!email || !isValidEmail(email)) {
        showFormMessage(formEl, 'Please enter a valid email address.', 'error');
        return;
      }

      const submitBtn = formEl.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      const originalText = submitBtn?.textContent ?? '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        try {
          formEl.reset();
        } catch {
          // ignore
        }
        showFormMessage(formEl, 'Thank you for subscribing!', 'success');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }, 900);
    }

    formEl.addEventListener('submit', onSubmit);
    return () => formEl.removeEventListener('submit', onSubmit);
  }, [pathname]);

  return null;
}
