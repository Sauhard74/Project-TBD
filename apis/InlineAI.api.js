import axios from 'axios';

const aiBaseUrl = 'https://ai.agastya.app/http';

/**
 * Sends a request to the server to get the inline selection response.
 * @param {Object} data - The data object should have the following keys:
 *                        - selection (string): The selected text
 *                        - page (string): InlineAiSectionsType
 *                        - choice (string): InlineAiChoicesType
 * @param {string} staff_id - (string) The ID of the staff.
 * @param {string} staff_name - (string) The name of the staff.
 * @returns {Promise} - A promise that resolves to the response from the server.
 * @throws {Error} - If an error occurs while sending the request.
 */
export const getInlineSelectionResponse = async (data, staff_id, staff_name) => {
  try {
    const payload = {
      user_query: JSON.stringify(data),
      user_details: {
        user_id: staff_id,
        user_name: staff_name,
        user_role: 'staff'
      }
    };

    const response = await axios.post(`${aiBaseUrl}/inline_with_selection`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

/**
 * Sends a request to the server to get an inline response.
 * @param {Object} data - The data object should have the following keys:
 *                        - page (string): InlineAiSectionsType
 *                        - prompt (string): The prompt to get the response for
 * @param {string} staff_id - (string) The ID of the staff making the request.
 * @param {string} staff_name - (string) The name of the staff making the request.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the server.
 * @throws {Error} - If an error occurs during the request.
 */
export const getInlineResponse = async (data, staff_id, staff_name) => {
  try {
    const payload = {
      user_query: JSON.stringify(data),
      user_details: {
        user_id: staff_id,
        user_name: staff_name,
        user_role: 'staff'
      }
    };
    const response = await axios.post(`${aiBaseUrl}/inline_start_writing`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
