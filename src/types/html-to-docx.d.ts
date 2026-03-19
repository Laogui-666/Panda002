declare module 'html-to-docx' {
  interface HTMLToDOCXOptions {
    table?: {
      border?: number;
    };
    footer?: boolean;
    pageNumber?: boolean;
  }

  export function HTMLtoDOCX(
    html: string,
    options?: any,
    config?: HTMLToDOCXOptions
  ): Promise<Buffer>;
}

declare module 'html-docx-js/dist/html-docx' {
  const htmlDocx: {
    asBlob(html: string): Blob;
  };
  export default htmlDocx;
}

declare module 'file-saver' {
  export function saveAs(data: Blob | string, filename?: string, options?: any): void;
}
