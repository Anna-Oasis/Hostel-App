import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

export interface PDFData {
  [fieldName: string]: string;
}

export async function generatePdf(templateName: string, data: PDFData): Promise<Buffer> {
  try {
    templateName+= '.pdf'; 
    const templatePath = path.resolve(__dirname, '../pdf-templates', templateName);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template "${templateName}" not found.`);
    }

    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // Fill form fields using keys from data
    Object.entries(data).forEach(([fieldName, value]) => {
      try {
        const field = form.getTextField(fieldName);
        field.setText(value);
      } catch (error) {
        console.warn(`⚠️ Field "${fieldName}" not found in template`);
      }
    });

    form.flatten(); // Optional: makes form non-editable

    const filledPdfBytes = await pdfDoc.save();
    
    // Optional: Save to file system as well
    const outputPath = path.resolve(__dirname, '../test_output', templateName);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, filledPdfBytes);
    
    console.log(`✅ PDF generated: ${outputPath}`);
    
    return Buffer.from(filledPdfBytes);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    throw error;
  }
}


