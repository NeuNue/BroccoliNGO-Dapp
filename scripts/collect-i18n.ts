import { Project, SyntaxKind, Node } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

// Define _TL_ function to ensure it exists during script execution
function _TL_(v: string): string {
  return v;
}

// Make _TL_ global to match the usage in the project
(global as any)._TL_ = _TL_;

function collectI18nStrings(): string[] {
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json')
  });

  const strings = new Set<string>();

  // Add all TypeScript and TSX files in the project
  const sourceFiles = project.addSourceFilesFromTsConfig('tsconfig.json');

  sourceFiles.forEach(sourceFile => {
    sourceFile.getDescendants().forEach(node => {
      // Check for call expressions
      if (Node.isCallExpression(node)) {
        const expression = node.getExpression();
        
        // Check if the function name is _TL_
        if (expression.getText() === '_TL_') {
          const firstArg = node.getArguments()[0];
          
          // Check if it's a string literal
          if (firstArg && 
              (Node.isStringLiteral(firstArg) || 
               Node.isNoSubstitutionTemplateLiteral(firstArg))) {
            let stringValue: string;
            
            if (Node.isStringLiteral(firstArg)) {
              stringValue = firstArg.getText().slice(1, -1);
            } else {
              stringValue = firstArg.getText().slice(1, -1);
            }
            
            strings.add(stringValue);
          }
        }
      }
    });
  });

  return Array.from(strings).sort();
}

function updateDictionaryFiles(newStrings: string[]) {
  const dictionariesPath = path.join(process.cwd(), 'dictionaries');
  const dictionaryFiles = ['en.json', 'zh.json'];

  dictionaryFiles.forEach(filename => {
    const filePath = path.join(dictionariesPath, filename);
    
    // Read existing dictionary
    let dictionary: Record<string, string>;
    try {
      dictionary = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      dictionary = {};
    }

    // Add new strings if they don't exist
    let updated = false;
    newStrings.forEach(str => {
      if (!dictionary[str]) {
        dictionary[str] = str;
        updated = true;
      }
    });

    // Write back to file if updated
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(dictionary, null, 2));
      console.log(`Updated ${filename}`);
    }
  });
}

function main() {
  try {
    const i18nStrings = collectI18nStrings();
    
    console.log('Collected I18n Strings:');
    i18nStrings.forEach(str => console.log(`- "${str}"`));

    // Write to dictionary files
    updateDictionaryFiles(i18nStrings);
  } catch (error) {
    console.error('Error collecting i18n strings:', error);
    process.exit(1);
  }
}

main();