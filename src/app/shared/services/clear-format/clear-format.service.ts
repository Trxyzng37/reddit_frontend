import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClearFormatService {

  constructor() { }

  formatForViewPost(htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const pTags = Array.from(doc.querySelectorAll('p')).reverse();
    for (const pTag of pTags) {
      if (pTag.textContent?.trim()) break;
      pTag.parentNode?.removeChild(pTag);
    }
    let result = doc.body.innerHTML.replace(/\s*\n\s*/g, '');
    return result;
  }

  formatForCreatePost(htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const pTags = Array.from(doc.querySelectorAll('p')).reverse();
    for (const pTag of pTags) {
      if (pTag.textContent?.trim()) break;
      pTag.parentNode?.removeChild(pTag);
    }
    let result = doc.body.innerHTML.replace(/\s*\n\s*/g, '');
    result = result+"<p></p>";
    return result;
  }

  removeInlineStyle(inputHtml: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(inputHtml, 'text/html');
    const elements = doc.body.querySelectorAll('*');
    elements.forEach((element) => {
      element.removeAttribute('style');
    });
    return doc.body.innerHTML;
  }

  hasInlineStyle(htmlString: string): boolean {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const elements = doc.body.querySelectorAll('*');
    return Array.from(elements).some(element => element.hasAttribute('style'));
  }
}
