import { captureException } from '@sentry/react-native';
import EventSource from 'react-native-event-source';
import { aiBaseUrl } from '../utilities/constants';

type SSEHandlers = {
  onChunk?: (data: MessageEvent['data']) => void;
  onFinal?: (data: MessageEvent['data']) => void;
  onError?: (error: MessageEvent['data']) => void;
};

function createSSEConnection(
  url: string,
  requestData: AiRequestType,
  { onChunk, onFinal, onError }: SSEHandlers = {}
) {
  const eventSource = new EventSource(url, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
    method: 'POST'
  });

  // Handle streaming
  if (onChunk) {
    eventSource.addEventListener('chunk', (event) => {
      onChunk(event.data);
    });
  }

  // Handle final output
  if (onFinal) {
    eventSource.addEventListener('final_response', (event) => {
      onFinal(event.data);
      eventSource.close();
    });
  }

  // Handle errors
  if (onError) {
    eventSource.addEventListener('error', (error) => {
      onError(error);
      captureException(error);
      eventSource.close();
    });
  }

  // close the connection for cleanup
  return () => eventSource.close();
}

export const streamAnyActivityBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/activity-block`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamObservationBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/observations-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamBehaviorBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/behavior-redressal-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamExpectedFlowBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/expected-flow-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamOpportunityBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/praise-opportunities-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamWxwdBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/what-will-x-do-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamDirectionsBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/procedure-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamFacilitatorPromptBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/facilitator-prompts-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamPanchadiBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/panchadi-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamPanchkoshaBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/panchakosha-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamWhyBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/why-block-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamTeacherRoleBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/teacher-role-block-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamSkillsBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/skills-block-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamAttitudesBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/attitudes-block-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const streamRiversideActivityBlock = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/activity-riverside-style-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const getSelectionAiResponse = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/inline-with-selection-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};

export const getInlineAiResponse = (
  payload: AiRequestType,
  streamCallback: (event: MessageEvent['data']) => void,
  onSuccess: (event: MessageEvent['data']) => void = () => {}
) => {
  const url = `${aiBaseUrl}/inline_start_writing-stream`;

  const closeConnection = createSSEConnection(url, payload, {
    onChunk: streamCallback,
    onFinal: onSuccess,
    onError: (error) => {
      console.error(error);
    }
  });

  return closeConnection;
};


