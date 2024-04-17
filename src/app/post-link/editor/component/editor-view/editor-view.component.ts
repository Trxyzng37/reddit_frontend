import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrl: './editor-view.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EditorViewComponent {

  public constructor(
    public sanitizer: DomSanitizer
  ) {}

  @Input() content: string = "";

  ngOnInit() {
    this.content = this.content.replace(/<img/g, '<img class="img" ');
    this.content = this.content.replace(/<figure/g, '<figure class="figure" ');
    this.content = this.content.replace(/<figcaption/g, '<figcaption class="figcaption" ');
    this.content = this.content.replace(/<pre/g, '<pre class="pre_code" ');
    this.content = this.content.replace(/<code/g, '<code class="code" ');
    this.content = this.content.replace(/<ol/g, '<ol class="ol" ');
    this.content = this.content.replace(/<ul/g, '<ul class="ul" ');
    this.content = this.content.replace(/<a/g, '<a class="a" ');
    this.content = this.content.replace(/<blockquote/g, '<blockquote class="blockquote" ');
  }

  // public viewSettings = {
  //   base_url: '/tinymce',
  //   suffix: '.min',
  //   placeholder: 'VIEW',
  //   contenteditable: false,
  //   toolbar: false,
  //   menubar: false,
  //   statusbar: false,
  //   width: '100%',
  //   height: '20vh',
  //   content_style: 
  //   'p { margin: 0; } ' + 
  //   'img { display: block; margin: 0 auto; }' +
  //   'body {line-height: normal}' +
  //   'pre[class*=language-] {font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;}',
  //   init_instance_callback: (editor:any)=>{
  //     console.log(editor.id)
  //     editor.mode.set('readonly', false);
  //   }
  // }
}
