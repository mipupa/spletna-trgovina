import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private renderer: Renderer2;
  private themeLinkElement: HTMLLinkElement | null = null;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setTheme(themeName: string): void {
    // Odstrani staro povezavo, če obstaja
    if (this.themeLinkElement) {
      this.renderer.removeChild(document.head, this.themeLinkElement);
    }

    // Ustvari novo povezavo
    this.themeLinkElement = this.renderer.createElement('link');
    this.renderer.setAttribute(this.themeLinkElement, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.themeLinkElement, 'type', 'text/css');
    this.renderer.setAttribute(
      this.themeLinkElement,
      'href',
      `assets/themes/${themeName}.css`
    );

    this.renderer.appendChild(document.head, this.themeLinkElement);
  }
}