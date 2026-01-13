// src/handlers/attachments.js
import fs from 'fs/promises';
import path from 'path';
import {
  requireBrainId,
  validateUrl,
  validateFilePath,
  createErrorResponse,
} from '../validation.js';

export async function addFileAttachment(api, args) {
  try {
    const { brainId, thoughtId, filePath, fileName } = args;

    // Validate inputs
    requireBrainId(brainId);
    const validatedPath = validateFilePath(filePath);

    // Verify file exists
    try {
      await fs.access(validatedPath);
    } catch (error) {
      throw new Error(`File not found: ${validatedPath}`);
    }

    // Get file info
    const stats = await fs.stat(validatedPath);
    const actualFileName = fileName || path.basename(validatedPath);

    await api.addFileAttachment(brainId, thoughtId, validatedPath, actualFileName);

    return {
      success: true,
      message: `File '${actualFileName}' attached to thought ${thoughtId}`,
      attachment: {
        fileName: actualFileName,
        filePath: validatedPath,
        size: stats.size,
        thoughtId,
      },
    };
  } catch (error) {
    return createErrorResponse(error, 'addFileAttachment');
  }
}

export async function addUrlAttachment(api, args) {
  try {
    const { brainId, thoughtId, url, name } = args;

    // Validate inputs
    requireBrainId(brainId);
    validateUrl(url);

    await api.addUrlAttachment(brainId, thoughtId, url, name);

    return {
      success: true,
      message: `URL '${url}' attached to thought ${thoughtId}`,
      attachment: {
        url,
        name: name || 'Auto-generated from page title',
        thoughtId,
      },
    };
  } catch (error) {
    return createErrorResponse(error, 'addUrlAttachment');
  }
}

export async function getAttachment(api, { brainId, attachmentId }) {
  try {
    requireBrainId(brainId);

    const attachment = await api.getAttachment(brainId, attachmentId);
    
    return {
      success: true,
      attachment: {
        id: attachment.id,
        brainId: attachment.brainId,
        sourceId: attachment.sourceId,
        sourceType: attachment.sourceType,
        sourceTypeName: getSourceTypeName(attachment.sourceType),
        name: attachment.name,
        type: attachment.type,
        typeName: getAttachmentTypeName(attachment.type),
        location: attachment.location,
        dataLength: attachment.dataLength,
        position: attachment.position,
        isNotes: attachment.isNotes,
        creationDateTime: attachment.creationDateTime,
        modificationDateTime: attachment.modificationDateTime,
        fileModificationDateTime: attachment.fileModificationDateTime,
      },
    };
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function getAttachmentContent(api, args) {
  try {
    const { brainId, attachmentId, saveToPath } = args;

    requireBrainId(brainId);

    const content = await api.getAttachmentContent(brainId, attachmentId);
    
    if (saveToPath) {
      // Save the content to a file
      await fs.writeFile(saveToPath, content);
      
      return {
        success: true,
        message: `Attachment content saved to ${saveToPath}`,
        savedTo: saveToPath,
        size: content.length,
      };
    } else {
      // Return content info without the actual binary data
      return {
        success: true,
        message: 'Attachment content retrieved',
        size: content.length,
        hint: 'Use saveToPath parameter to save the content to a file',
      };
    }
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function deleteAttachment(api, { brainId, attachmentId }) {
  try {
    requireBrainId(brainId);

    await api.deleteAttachment(brainId, attachmentId);
    
    return {
      success: true,
      message: `Attachment ${attachmentId} deleted successfully`,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function listAttachments(api, { brainId, thoughtId }) {
  try {
    requireBrainId(brainId);

    const attachments = await api.listAttachments(brainId, thoughtId);
    
    return {
      success: true,
      count: attachments.length,
      attachments: attachments.map(att => ({
        id: att.id,
        name: att.name,
        type: att.type,
        typeName: getAttachmentTypeName(att.type),
        location: att.location,
        dataLength: att.dataLength,
        isNotes: att.isNotes,
        position: att.position,
      })),
    };
  } catch (error) {
    return createErrorResponse(error);
  }
}

// Helper functions
function getSourceTypeName(sourceType) {
  const types = {
    1: 'Brain',
    2: 'Thought',
    3: 'Link',
    4: 'Attachment',
    5: 'BrainSetting',
    6: 'BrainAccess',
    7: 'CalendarEvent',
    8: 'FieldInstance',
    9: 'FieldDefinition',
  };
  return types[sourceType] || 'Unknown';
}

function getAttachmentTypeName(type) {
  // Common attachment type values (these may vary based on TheBrain's implementation)
  const types = {
    0: 'File',
    1: 'URL',
    2: 'InternalFile',
    3: 'ExternalFile',
    4: 'WebLink',
  };
  return types[type] || `Type${type}`;
}