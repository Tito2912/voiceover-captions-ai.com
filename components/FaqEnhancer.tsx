'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type ButtonAndAnswer = {
  button: HTMLButtonElement;
  answer: HTMLElement;
};

function resolveAnswer(button: HTMLButtonElement): HTMLElement | null {
  const controlledId = button.getAttribute('aria-controls');
  if (controlledId) return document.getElementById(controlledId);

  const next = button.nextElementSibling;
  if (next instanceof HTMLElement && next.classList.contains('faq-a')) return next;
  return null;
}

function resolveVoiceoverAnswer(button: HTMLButtonElement): HTMLElement | null {
  const next = button.nextElementSibling;
  if (next instanceof HTMLElement && next.classList.contains('faq-answer')) return next;

  const parent = button.parentElement;
  if (!parent) return null;
  return parent.querySelector<HTMLElement>('.faq-answer');
}

export function FaqEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const starterButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('button.faq-q'));
    const voiceoverButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('button.faq-question'));
    if (!starterButtons.length && !voiceoverButtons.length) return;

    const starterPairs: ButtonAndAnswer[] = [];
    const buttonToAnswer = new Map<HTMLButtonElement, HTMLElement>();
    for (const button of starterButtons) {
      const answer = resolveAnswer(button);
      if (!answer) continue;

      const expanded = button.getAttribute('aria-expanded') === 'true';
      answer.hidden = !expanded;
      answer.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      starterPairs.push({ button, answer });
      buttonToAnswer.set(button, answer);
    }

    function closeSiblingsWithinSameFaqRoot(targetButton: HTMLButtonElement) {
      const root = targetButton.closest('.faq');
      if (!root) return;

      for (const { button, answer } of starterPairs) {
        if (button === targetButton) continue;
        if (!root.contains(button)) continue;
        button.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
        answer.setAttribute('aria-hidden', 'true');
      }
    }

    const voiceoverPairs: ButtonAndAnswer[] = [];
    const voiceoverButtonToAnswer = new Map<HTMLButtonElement, HTMLElement>();
    for (const button of voiceoverButtons) {
      const answer = resolveVoiceoverAnswer(button);
      if (!answer) continue;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      answer.style.display = expanded ? 'block' : 'none';
      voiceoverPairs.push({ button, answer });
      voiceoverButtonToAnswer.set(button, answer);
    }

    function closeSiblingsWithinSameFaqList(targetButton: HTMLButtonElement) {
      const root = targetButton.closest('.faq-list') ?? targetButton.closest('.faq');
      if (!root) return;

      for (const { button, answer } of voiceoverPairs) {
        if (button === targetButton) continue;
        if (!root.contains(button)) continue;
        button.setAttribute('aria-expanded', 'false');
        answer.style.display = 'none';
      }
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const starterButton = target?.closest('button.faq-q') as HTMLButtonElement | null;
      if (starterButton) {
        const answer = buttonToAnswer.get(starterButton);
        if (!answer) return;

        const isExpanded = starterButton.getAttribute('aria-expanded') === 'true';
        const nextExpanded = !isExpanded;

        if (nextExpanded) closeSiblingsWithinSameFaqRoot(starterButton);

        starterButton.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
        answer.hidden = !nextExpanded;
        answer.setAttribute('aria-hidden', nextExpanded ? 'false' : 'true');
        return;
      }

      const voiceoverButton = target?.closest('button.faq-question') as HTMLButtonElement | null;
      if (!voiceoverButton) return;

      const answer = voiceoverButtonToAnswer.get(voiceoverButton);
      if (!answer) return;

      const isExpanded = voiceoverButton.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !isExpanded;

      if (nextExpanded) closeSiblingsWithinSameFaqList(voiceoverButton);

      voiceoverButton.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
      answer.style.display = nextExpanded ? 'block' : 'none';
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  return null;
}
