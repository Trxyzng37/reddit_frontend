import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import Swal from 'sweetalert2';
import tinymce from 'tinymce';
import { ShareDataService } from '../share_data/share-data.service';
import { EditorObj } from '../share_data/editor';

@Injectable({
  providedIn: 'root'
})
export class EditorSettingService {

  constructor(
    private storageService: StorageService,
    private shareDataService: ShareDataService
  ) { }

  public setupEditor(editor: any, type: string, editor_id: string, prev_content: string) {
    // editor_id = editor.id.toString();
    // console.log(editor_id);
    this.changeEditorColorBaseOnMode(editor, type);
    editor.on("NodeChange", () => {
      let image_allowed: number = 0;
      if(type == "post") {
        image_allowed = 4;
      }
      if(type == "comment") {
        image_allowed = 2;
      }
      let img_count = this.countImagesExistInEditor(editor);
      if (img_count == image_allowed + 1) {
        editor.setContent(prev_content, { format: 'html' });
        Swal.fire(`Maximum ${image_allowed - 1} images allowed`, '', 'warning')
      }
      else {
        prev_content = editor.getContent();
      }
    })
  }

  public countImagesExistInEditor(editor: any): number {
    const parser = new DOMParser();
    const doc = parser.parseFromString(editor.getContent(), "text/html");
    const imgElements = doc.querySelectorAll("img");
    // console.log("img found: " + imgElements.length);
    return imgElements.length;
  }

  public changeEditorColorBaseOnMode(editor: any, type: string) {
    const backgroundColor = 'var(--primary_background_color)';
    const textColor = 'var(--icon)';
    const border = "var(--border)";
    const container = editor.getContainer();
    let tox_tiny = container.parentElement.childNodes;
    let tox_tinymce = tox_tiny[2];
    tox_tinymce.style.border = "1px solid var(--border)";
    container.querySelector('.tox-editor-header').style.backgroundColor = backgroundColor;
    container.querySelector('.tox-editor-container').style.backgroundColor = backgroundColor;
    container.querySelector('.tox-statusbar').style.backgroundColor = backgroundColor;
    container.querySelector('.tox-toolbar').style.backgroundColor = backgroundColor;
    container.querySelector('iframe').style.backgroundColor = backgroundColor;
    container.querySelector('.tox-toolbar').style.color = textColor;
    container.querySelector('.tox-toolbar').style.borderBottom = "1px solid var(--border)";
    container.querySelector('.tox-toolbar').style.backgroundImage = "repeating-linear-gradient(var(--border) 0 1px,transparent 1px 39px)";
    container.querySelector('.tox-statusbar').style.borderTop = "1px solid var(--border)";
    container.querySelector('.tox-statusbar').style.padding = "0";
    container.querySelector('.tox-statusbar').style.display = "flex";
    container.querySelector('.tox-statusbar').style.justifyContent = "flex-end";
    let resize_handler = container.querySelector('.tox-statusbar').querySelector('.tox-statusbar__resize-handle');
    // resize_handler.style.width = "30px";
    // resize_handler.style.height = "30px";
    resize_handler.style.cursor = "n-resize";
    let resize_icon = container.querySelector('.tox-statusbar').querySelector('.tox-statusbar__resize-handle').querySelector('svg');
    resize_icon.style.fill = textColor;
    // resize_icon.style.width = "30px";
    // resize_icon.style.height = "30px";
    resize_icon.style.marginTop = "5px";
    resize_icon.setAttribute('viewBox', '-1 -1 15 15');
    resize_icon.setAttribute("preserveAspectRatio", "xMidYMid meet")
    if(type == "post") {
      const height: string = "30px";
      container.querySelector('.tox-statusbar').style.height = height;
      resize_handler.style.width = height;
      resize_handler.style.height = height;
      resize_icon.style.width = height;
      resize_icon.style.height = height;
    }
    if(type == "comment") {
      const height: string = "40px";
      container.querySelector('.tox-statusbar').style.height = height;
      resize_handler.style.width = height;
      resize_handler.style.height = height;
      resize_icon.style.width = height;
      resize_icon.style.height = height;
    }
    //set hover for format button
    let btn = container.querySelectorAll('.tox-tbtn');
    btn.forEach((b: any) => {
      b.classList.add('btn_editor');
    });
    setInterval(() => {
      let btn = container.querySelectorAll('.tox-tbtn');
      btn.forEach((b: any) => {
        b.style.backgroundColor = backgroundColor;
      });
      let svg = container.querySelectorAll('svg');
      svg.forEach((b: any) => {
        b.style.fill = textColor;
      });
      let selected_btn = container.querySelectorAll('.tox-tbtn--enabled');
      selected_btn.forEach((b: any) => {
        b.style.backgroundColor = border;
      });
      const mode = this.storageService.getItem("mode") == "" ? 0 : Number.parseInt(this.storageService.getItem("mode"));
      const iframeBody = container.querySelector('iframe').contentDocument?.body;
      if(iframeBody) {
      //dark
        if (mode == 1) {
          iframeBody.style.setProperty('--icon', 'white');
          iframeBody.style.setProperty('--border', '#ffffff33');
          iframeBody.style.setProperty('--link', '#629FFF');

        }
      //light
        else {
          iframeBody.style.setProperty('--icon', 'black');
          iframeBody.style.setProperty('--border', '#00000033');
          iframeBody.style.setProperty('--link', '#0045AC');
        }
      }
    }, 150);
  }

  public content_style: string =       
      ':root {' +
        '--icon: black;' +
        '--border: #00000033;' +
        '--link: #0045AC;' +
      '} ' +
      '.token.operator {' +
        'background: none !important;' +
      '} ' +
      'html body {' +
        'overflow-y: auto !important;' +
        'margin: 20px;' +
        'color: var(--icon);' +
      '} ' +
      'p {' +
        'margin: 0;' +
        'margin-bottom: 16px;' +
        'color: var(--icon);' +
      '} ' +
      'a {' +
        'color: var(--link) !important;' +
      '} ' +
      'img {' +
        'display: inline-block;' +
        'outline: none;' +
        'max-width: 100%;' +
        'border-radius: 10px' +
      '} ' +
      'body {' +
        'line-height: normal;' +
      '} ' +
      'figure {' +
        'margin: 0;' +
        'margin-bottom: 10px;' +
        'min-width: 30% !important;' +
        // 'width: 100%;' +
      '} ' +
      '[data-mce-selected="1"], .mce-content-body [contentEditable="false"] [contentEditable="true"]:hover, .mce-content-body [contentEditable="false"] [contentEditable="true"]:focus {' +
        'outline: none !important;' +
        'border: 1px solid var(--link);' +
        'border-radius: 10px' +
      '} ' +
      'figure figcaption {' +
        'color: var(--icon);' +
        'background-color: var(--border);' +
        'font-size: 12px;' +
        'border-radius: 10px;' +
        'height: auto;' +
        'word-break: break-word;' +
        'padding-left: 5px;' +
        'padding-right: 5px;' +
        'padding-bottom: 4px;' +
        'border: none !important;' +
      '} ' +
      'pre {' +
        'font-family: Consolas;' +
        'background-color: var(--border) !important;' +
        'color: var(--icon) !important;' +
        'outline: none;' +
        'padding: 10px 10px;' +
        'font-size: 13px;' +
        'width: 100%;' +
        'box-sizing: border-box;' +
        'word-break: break-word;' +
        'white-space: initial;' +
        'border: 1px solid var(--icon);' +
        'margin-bottom: 16px !important;' +
      '} ' +
      'blockquote {' +
        'margin: 0 0 16px 16px !important;' +
        'border-left: 4px solid var(--border) !important;' +
        'padding: 5px 10px !important;' +
        'padding-right: 0px' +
      '}' +
      'blockquote p, pre p {' +
        'margin-bottom: 0 !important;' +
      '}' +
      'ul, ol {' +
        'margin-bottom: 16px;' +
      '}' 

      //main setting
      public setEditorSettings(type: string, editor_id: string, prev_content: string) {
        let editor_height: number = 0;
        if(type == "post")
          editor_height = 300;
        if(type == "comment")
          editor_height = 200;
        return {
          base_url: '/tinymce',
          suffix: '.min',
          plugins: 'link lists codesample image',
          toolbar: "bold italic underline strikethrough superscript removeformat | numlist bullist | blockquote customCodeButton link customImageButton ",
          toolbar_mode: 'wrap',
          placeholder: '(Optional)',
          automatic_uploads: true,
          file_picker_types: 'image',
          images_file_types: 'jpg,png,jpeg',
          images_reuse_filename: true,
          image_dimensions: false,
          image_caption: true,
          image_description: false,
          codesample_languages: [
            { text: 'Default', value: 'javascript' },
          ],
          statusbar: true,
          elementpath: false,
          branding: false,
          resize: true,
          width: '100%',
          height: editor_height,
          min_height: editor_height,
          autoresize_min_height: editor_height,
          menubar: false,
          draggable_modal: false,
          object_resizing: false,
          inline_boundaries: false,
          contenteditable: false,
          paste_data_images: false,
          paste_block_drop: false,
          custom_colors: false,
          content_css: 'tinymce-5',
          content_style: this.content_style,
          setup: (editor: any) => {
            editor.ui.registry.addButton('customCodeButton', {
              icon: 'code-sample',  
              tooltip: 'Code block',
              onAction: function () {
                const selectedNode = editor.selection.getNode();
                if (selectedNode.nodeName === 'PRE' || selectedNode.nodeName === 'P' && selectedNode.closest('pre')) {
                  let codeContent = selectedNode.innerHTML.replace(/<\/?pre>/g, ''); 
                  editor.dom.remove(selectedNode); 
                  editor.selection.setContent(codeContent, { format: 'html' }); 
                } 
                else {
                  const selectedContent = editor.selection.getContent({ format: 'html' }).trim();
                  if (selectedContent) {
                    editor.selection.setContent(`<pre>${selectedContent}</pre>`, { format: 'raw' });
                  } 
                  else {
                    editor.insertContent('<pre></pre>', { format: 'raw' });
                  }
                }
              }
            });
            
            editor.ui.registry.addButton('customImageButton', {  
              icon: 'image',         
              tooltip: 'Insert image',
              onAction: function () {
                let input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/png, image/jpg, image/jpeg';
                
                input.onchange = function (event: any) {
                  const file = event.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e: any) {
                      if(type == "post") {
                        editor.insertContent(`<figure class="image">
                          <img src="${e.target.result}"/>
                          <figcaption contenteditable="true">caption</figcaption>
                        </figure>
                        <p></p>
                        <div id="sel-mce_0" class="mce-offscreen-selection">
                          <figure class="image">
                            <img src="${e.target.result}"/>
                            <figcaption contenteditable="true">caption</figcaption>
                          </figure>
                          <p></p>
                        </div>`);
                      }
                      if(type == "comment") {
                        editor.insertContent(`<figure class="image">
                          <img src="${e.target.result}"/>
                        </figure>
                        <p></p>
                        <div id="sel-mce_0" class="mce-offscreen-selection">
                          <figure class="image">
                            <img src="${e.target.result}"/>
                          </figure>
                          <p></p>
                        </div>`);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }
            });
          },
          init_instance_callback: (editor: any) => {
            console.info("create editor with cid "+editor_id+" and editor_id: "+editor.id);
            this.shareDataService.setEditor(new EditorObj(editor_id, editor.id));
            this.setupEditor(editor, type, editor_id, prev_content);
          },
          file_picker_callback: (cb: any, value: any, meta: any) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', '.png, .jpg, .jpeg');
            input.addEventListener('change', (e: any) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                const id = file.name;
                const blobCache = tinymce.activeEditor!.editorUpload.blobCache;
                const base64 = (<string>reader.result).split(',')[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);
                cb(blobInfo.blobUri(), { title: file.name });
              });
              reader.readAsDataURL(file);
            })
            input.click();
          }
        }
      }
}
