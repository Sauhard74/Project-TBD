import { apiInstance } from '../context/Configuration';
import { captureException } from '@sentry/react-native';

/**
 * Fetches the units for a given class.
 *
 * @param classId - The ID of the class for which to fetch units.
 * @param page - (Optional) The page number for pagination.
 * @param excludeFolderUnits - (Optional) Whether to exclude folder units. Defaults to `false`.
 * @returns A promise that resolves to an array of `UnitType` objects.
 * @throws Will capture and log any exceptions that occur during the API call.
 */
export const fetchClassUnits = async (
  classId: string,
  page?: number,
  excludeFolderUnits: boolean = false
) => {
  try {
    const response = await apiInstance.get(`/class_units/${classId}`, {
      headers: {
        PageNumber: page || null,
        ExcludeFolderUnit: excludeFolderUnits
      }
    });

    return response?.data?.result as UnitType[];
  } catch (error) {
    captureException(error);
    return [];
  }
};

/**
 * Fetches a unit by its ID.
 *
 * @param unitId - The ID of the unit to fetch.
 * @returns A promise that resolves to the unit data of type `UnitType` if successful, or `null` if an error occurs.
 */
export const fetchUnit = async (unitId: string) => {
  try {
    const response = await apiInstance.get(`/units/${unitId}`);

    return response?.data as {
      unit: UnitType;
      days_activities: ActivitySectionType[];
      activities: ActivityType[];
      curriculum_entities: CurriculumEntityWithParentType[];
    };
  } catch (error) {
    captureException(error);
    throw error;
  }
};

/**
 * Creates a new unit.
 *
 * @param unitData - The data for the new unit.
 * @returns A promise that resolves to the id of the created unit.
 * @throws Will throw an error if the creation fails.
 */
export const createUnit = async (unitData: UnitType) => {
  try {
    const response = await apiInstance.post('/units/', unitData);

    return response?.data as { unit: { id: string } };
  } catch (error) {
    captureException(error);
    throw error;
  }
};

/**
 * Modifies an existing unit.
 *
 * @param unitId - The ID of the unit to modify.
 * @param unitData - The updated data for the unit.
 * @returns A promise that resolves to the id of the modified unit.
 * @throws Will throw an error if the modification fails.
 */
export const modifyUnit = async (unitId: string, unitData: UnitType) => {
  try {
    const response = await apiInstance.post(`/units/${unitId}`, unitData);
    return response?.data;
  } catch (error) {
    captureException(error);
    throw error;
  }
};

/**
 * Deletes a specified unit.
 *
 * @param {string} unitId - The ID of the unit to be deleted.
 * @returns {Promise<void>} A promise that resolves when the unit is deleted.
 * @throws Will throw an error if the deletion fails.
 */
export const deleteUnit = async (unitId: string) => {
  try {
    await apiInstance.delete(`/units/${unitId}`);
  } catch (error) {
    captureException(error);
    throw error;
  }
};

/**
 * Modifies the day plan for a unit.
 *
 * @param project_days_activities - Array of day activities.
 * @param unit_id - The unit ID.
 * @returns The server response data.
 * @throws Will throw an error if the request fails.
 */
export const modifyDayPlan = async (
  project_days_activities: {
    activity_day: number;
    thinking: string;
    activities: { activity_id?: string; title: string }[];
    day_title?: string;
  }[],
  unit_id: string
) => {
  try {
    const response = await apiInstance.post(`/edit_project_day_plan/`, {
      project_days_activities,
      unit_id
    });

    return response.data;
  } catch (error) {
    captureException(error);
    throw error;
  }
};
