// src/handlers/thoughts.js
import {
  requireBrainId,
  validateColor,
  createErrorResponse,
} from '../validation.js';

export async function listBrains(api) {
  try {
    const brains = await api.listBrains();
    return {
      success: true,
      brains: brains.map(brain => ({
        id: brain.id,
        name: brain.name,
        homeThoughtId: brain.homeThoughtId,
      })),
    };
  } catch (error) {
    return createErrorResponse(error, 'listBrains');
  }
}

export async function getBrain(api, { brainId }) {
  try {
    const brain = await api.getBrain(brainId);
    return {
      success: true,
      brain: {
        id: brain.id,
        name: brain.name,
        homeThoughtId: brain.homeThoughtId,
      },
    };
  } catch (error) {
    return createErrorResponse(error, 'getBrain');
  }
}

export async function setActiveBrain(api, { brainId }) {
  try {
    // Verify brain exists
    await api.getBrain(brainId);
    return {
      success: true,
      message: `Active brain set to ${brainId}`,
    };
  } catch (error) {
    return createErrorResponse(error, 'setActiveBrain');
  }
}

export async function createThought(api, args) {
  try {
    const {
      brainId,
      name,
      kind = 1, // Default to Normal
      label,
      foregroundColor,
      backgroundColor,
      typeId,
      sourceThoughtId,
      relation,
      acType = 0, // Default to Public
    } = args;

    requireBrainId(brainId);
    validateColor(foregroundColor, 'foregroundColor');
    validateColor(backgroundColor, 'backgroundColor');

    const thoughtData = {
      name,
      kind,
      acType,
    };

    // Add optional properties
    if (label) thoughtData.label = label;
    if (typeId) thoughtData.typeId = typeId;
    if (sourceThoughtId) {
      thoughtData.sourceThoughtId = sourceThoughtId;
      thoughtData.relation = relation || 1; // Default to Child
    }

    // Create the thought
    const result = await api.createThought(brainId, thoughtData);
    const thoughtId = result.id;

    // Apply visual properties if provided
    if (foregroundColor || backgroundColor) {
      const updates = {};
      if (foregroundColor) updates.foregroundColor = foregroundColor;
      if (backgroundColor) updates.backgroundColor = backgroundColor;
      
      await api.updateThought(brainId, thoughtId, updates);
    }

    return {
      success: true,
      thought: {
        id: thoughtId,
        name,
        brainId,
        ...thoughtData,
        ...(foregroundColor && { foregroundColor }),
        ...(backgroundColor && { backgroundColor }),
      },
    };
  } catch (error) {
    return createErrorResponse(error, 'createThought');
  }
}

export async function getThought(api, { brainId, thoughtId }) {
  try {
    requireBrainId(brainId);

    const thought = await api.getThought(brainId, thoughtId);
    
    return {
      success: true,
      thought: {
        id: thought.id,
        brainId: thought.brainId,
        name: thought.name,
        label: thought.label,
        kind: thought.kind,
        kindName: getKindName(thought.kind),
        typeId: thought.typeId,
        foregroundColor: thought.foregroundColor,
        backgroundColor: thought.backgroundColor,
        acType: thought.acType,
        acTypeName: thought.acType === 0 ? 'Public' : 'Private',
        creationDateTime: thought.creationDateTime,
        modificationDateTime: thought.modificationDateTime,
      },
    };
  } catch (error) {
    return createErrorResponse(error, 'getThought');
  }
}

export async function updateThought(api, args) {
  try {
    const {
      brainId,
      thoughtId,
      name,
      label,
      foregroundColor,
      backgroundColor,
      kind,
      acType,
      typeId,
    } = args;

    requireBrainId(brainId);
    validateColor(foregroundColor, 'foregroundColor');
    validateColor(backgroundColor, 'backgroundColor');

    const updates = {};
    
    // Build update object with only provided fields
    if (name !== undefined) updates.name = name;
    if (label !== undefined) updates.label = label;
    if (foregroundColor !== undefined) updates.foregroundColor = foregroundColor;
    if (backgroundColor !== undefined) updates.backgroundColor = backgroundColor;
    if (kind !== undefined) updates.kind = kind;
    if (acType !== undefined) updates.acType = acType;
    if (typeId !== undefined) updates.typeId = typeId;

    await api.updateThought(brainId, thoughtId, updates);

    return {
      success: true,
      message: `Thought ${thoughtId} updated successfully`,
      updates,
    };
  } catch (error) {
    return createErrorResponse(error, 'updateThought');
  }
}

export async function deleteThought(api, { brainId, thoughtId }) {
  try {
    requireBrainId(brainId);

    await api.deleteThought(brainId, thoughtId);
    
    return {
      success: true,
      message: `Thought ${thoughtId} deleted successfully`,
    };
  } catch (error) {
    return createErrorResponse(error, 'deleteThought');
  }
}

export async function searchThoughts(api, args) {
  try {
    const {
      brainId,
      queryText,
      maxResults = 30,
      onlySearchThoughtNames = false,
    } = args;

    requireBrainId(brainId);

    const results = await api.searchThoughts(
      brainId,
      queryText,
      maxResults,
      onlySearchThoughtNames
    );

    const response = {
      success: true,
      count: results.length,
      maxResults,
      results: results.map(result => ({
        thoughtId: result.sourceThought?.id,
        name: result.name || result.sourceThought?.name,
        type: getSearchResultTypeName(result.searchResultType),
        snippet: result.snippet,
        attachmentId: result.attachmentId,
      })),
    };

    // Warn if results may be truncated
    if (results.length === maxResults) {
      response.warning = `Results may be truncated. Received exactly ${maxResults} results (the maximum requested). More results may exist - try refining your query or increasing maxResults.`;
    }

    return response;
  } catch (error) {
    return createErrorResponse(error, 'searchThoughts');
  }
}

export async function getThoughtGraph(api, { brainId, thoughtId, includeSiblings = false }) {
  try {
    requireBrainId(brainId);

    const graph = await api.getThoughtGraph(brainId, thoughtId, includeSiblings);
    
    return {
      success: true,
      graph: {
        activeThought: formatThought(graph.activeThought),
        parents: graph.parents?.map(formatThought) || [],
        children: graph.children?.map(formatThought) || [],
        jumps: graph.jumps?.map(formatThought) || [],
        siblings: graph.siblings?.map(formatThought) || [],
        tags: graph.tags?.map(formatThought) || [],
        type: graph.type ? formatThought(graph.type) : null,
        links: graph.links?.map(formatLink) || [],
        attachments: graph.attachments?.map(formatAttachment) || [],
      },
    };
  } catch (error) {
    return createErrorResponse(error, 'getThoughtGraph');
  }
}

export async function getTypes(api, { brainId }) {
  try {
    requireBrainId(brainId);

    const types = await api.getTypes(brainId);
    
    return {
      success: true,
      types: types.map(formatThought),
    };
  } catch (error) {
    return createErrorResponse(error, 'getTypes');
  }
}

export async function getTags(api, { brainId }) {
  try {
    requireBrainId(brainId);

    const tags = await api.getTags(brainId);
    
    return {
      success: true,
      tags: tags.map(formatThought),
    };
  } catch (error) {
    return createErrorResponse(error, 'getTags');
  }
}

// Helper functions
function getKindName(kind) {
  const kinds = {
    1: 'Normal',
    2: 'Type',
    3: 'Event',
    4: 'Tag',
    5: 'System',
  };
  return kinds[kind] || 'Unknown';
}

function getSearchResultTypeName(type) {
  const types = [
    'Unknown',
    'Thought',
    'Link',
    'Attachment',
    'Note',
    'Label',
    'Type',
    'Tag',
  ];
  return types[type] || 'Unknown';
}

function formatThought(thought) {
  if (!thought) return null;
  
  return {
    id: thought.id,
    name: thought.name,
    label: thought.label,
    kind: thought.kind,
    kindName: getKindName(thought.kind),
    foregroundColor: thought.foregroundColor,
    backgroundColor: thought.backgroundColor,
  };
}

function formatLink(link) {
  return {
    id: link.id,
    thoughtIdA: link.thoughtIdA,
    thoughtIdB: link.thoughtIdB,
    name: link.name,
    color: link.color,
    thickness: link.thickness,
    relation: link.relation,
    direction: link.direction,
  };
}

function formatAttachment(attachment) {
  return {
    id: attachment.id,
    name: attachment.name,
    type: attachment.type,
    location: attachment.location,
    dataLength: attachment.dataLength,
  };
}