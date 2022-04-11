declare module 'pdf2json' {
    type PDFParserDataReadyEvent = 'pdfParser_dataReady';
    type PDFParserDataErrorEvent = 'pdfParser_dataError';
  
    export interface PDFPagesFill {
      x: number;
      y: number;
      clr: number;
  
      /**
       * 너비(Width)
       */
      w: number;
  
      /**
       * 높이(Height)
       */
      h: number;
  
      /**
       * Color
       */
      oc: string;
    }
  
    export interface PDFPageText {
      x: number;
      y: number;
      sw: number;
      text: string;
  
      /**
       * Text Color
       */
      oc: string;
    }
  
    export interface PDFPage {
      Fills: Array<PDFPagesFill>;
      Texts: Array<PDFPageText>;
    }
  
    export interface PDFFormImage {
      Pages: Array<PDFPage>;
    }
  
    export interface PDFDataReady {
      formImage: PDFFormImage;
    }
  
    export type PDFParserError = {
      parserError: Error;
    };
  
    export type PDFPagesFills = Array<PDFPagesFill>;
    export type PDFPageTexts = Array<PDFPageText>;
  
    class PdfParser {
  
      // Data Ready
      on(
        eventName: PDFParserDataReadyEvent,
        callback: (data: PDFFormImage) => void
      ): void;
  
      // Data Error
      on(
        eventName: PDFParserDataErrorEvent,
        callback: (error: PDFParserError) => void
      ): void;
  
      parseBuffer(buffer: Buffer): void;

      loadPDF(filePath: string, verbosity: 0 | 1): void;
    }
  
    export default PdfParser;
  }