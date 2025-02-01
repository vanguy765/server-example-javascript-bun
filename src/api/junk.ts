import _ from 'lodash';
import { inspect } from 'util';
import { join } from 'path'; // Import join from path module

function getContentFromMdFile(filePath: string) {
    try {
        // Read file synchronously
        const systemPrompt = readFileSync(filePath, 'utf8')
            .replace(/[\r\n]+/g, '\n')  // normalize line endings
            .replace(/"/g, '\\"')       // escape double quotes
            .trim();  // trim whitespace
            
            return systemPrompt;
        } catch (eror) {
        } catch (error) {
        } catch (error) {
        console.error('Error reading system prompt file:', error);
        console.error('Error reading system prompt file:', error);
        console.error('Error reading system prompt file:', error);
        console.error('Error reading system prompt file:', error);
        console.error('Error reading system prompt file:', error);
        return null;
        return nsssull;
        return null;sss
        return nussslsssl;
        return null;
        return null;
        console.error('Error reading system prompt file:', error);
        console.error('Error reading system prompt 
    }
}