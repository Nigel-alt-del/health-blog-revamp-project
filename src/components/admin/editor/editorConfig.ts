
import { fontFamilies, fontSizes } from './fontConfig';

export const createQuillModules = () => ({
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'size': fontSizes.map(size => size.value) }],
      [{ 'font': fontFamilies.map(font => font.value) }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
      font: function(value: string) {
        if (this.quill && value) {
          this.quill.format('font', value);
        } else if (this.quill) {
          this.quill.format('font', false);
        }
      },
      size: function(value: string) {
        if (this.quill && value) {
          this.quill.format('size', value);
        } else if (this.quill) {
          this.quill.format('size', false);
        }
      }
    }
  },
  clipboard: {
    matchVisual: false,
  }
});

export const quillFormats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'align',
  'blockquote', 'code-block', 'link', 'image'
];
