import * as XLSX from 'xlsx'

export interface ProductData {
  order: string
  style: string
  fit: string
  type: string
  pantType: string
  material: string
  materialComposition: string
  price: number
  sell: number
  color: string
  seller: string
}

interface RawExcelRow {
  Order: string | number;
  Style: string | number;
  Fit: string | number;
  Type: string | number;
  'Pant type': string | number;
  MATERIAL: string | number;
  'Material composition': string | number;
  Price: string | number;
  Sell: string | number;
  Color: string | number;
  Seller: string | number;
}

export async function parseExcelFile(file: File): Promise<ProductData[]> {
  console.log('Starting to parse Excel file:', file.name);
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Raw Excel data:', jsonData);

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          throw new Error('No data found in the Excel file');
        }
        
        // Transform and validate the data
        const transformedData: ProductData[] = jsonData.map((row, index) => {
          const typedRow = row as RawExcelRow;
          
          // Validate numeric fields
          const price = Number(typedRow.Price);
          const sell = Number(typedRow.Sell);
          
          if (isNaN(price)) {
            throw new Error(`Invalid price value at row ${index + 1}`);
          }
          if (isNaN(sell)) {
            throw new Error(`Invalid sell value at row ${index + 1}`);
          }
          
          // Clean and validate string fields
          const cleanString = (value: any) => {
            if (value === undefined || value === null) return '';
            return String(value).trim();
          };
          
          return {
            order: cleanString(typedRow.Order),
            style: cleanString(typedRow.Style),
            fit: cleanString(typedRow.Fit),
            type: cleanString(typedRow.Type),
            pantType: cleanString(typedRow['Pant type']),
            material: cleanString(typedRow.MATERIAL),
            materialComposition: cleanString(typedRow['Material composition']),
            price: price,
            sell: sell,
            color: cleanString(typedRow.Color),
            seller: cleanString(typedRow.Seller)
          };
        });
        
        // Additional validation
        if (transformedData.some(item => item.price < 0)) {
          throw new Error('Found negative price values in the data');
        }
        if (transformedData.some(item => item.sell < 0)) {
          throw new Error('Found negative sell values in the data');
        }
        
        resolve(transformedData)
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : String(error)}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}
