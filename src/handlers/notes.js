// src/handlers/notes.js
import {
  requireBrainId,
  createErrorResponse,
} from '../validation.js';

export async function getNote(api, args) {
  try {
    const { brainId, thoughtId, format = 'markdown' } = args;

    requireBrainId(brainId);

    const note = await api.getNote(brainId, thoughtId, format);
    
    return {
      success: true,
      note: {
        brainId: note.brainId,
        thoughtId: note.sourceId,
        format,
        content: note[format] || note.markdown || note.text || '',
        modificationDateTime: note.modificationDateTime,
      },
    };
  } catch (error) {
    return createErrorResponse(error, 'getNote');
  }
}

export async function createOrUpdateNote(api, args) {
  try {
    const { brainId, thoughtId, markdown } = args;

    requireBrainId(brainId);

    await api.createOrUpdateNote(brainId, thoughtId, markdown);
    
    return {
      success: true,
      message: `Note for thought ${thoughtId} updated successfully`,
      thoughtId,
    };
  } catch (error) {
    return createErrorResponse(error, 'createOrUpdateNote');
  }
}

export async function appendToNote(api, args) {
  try {
    const { brainId, thoughtId, markdown } = args;

    requireBrainId(brainId);

    await api.appendToNote(brainId, thoughtId, markdown);
    
    return {
      success: true,
      message: `Content appended to note for thought ${thoughtId}`,
      thoughtId,
    };
  } catch (error) {
    return createErrorResponse(error, 'appendToNote');
  }
}