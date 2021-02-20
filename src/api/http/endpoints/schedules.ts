import { model, time } from '@peter-murray/hue-bridge-model';
import { extractUpdatedAttributes, parseErrors, wasSuccessful } from '../../../util';
import { ApiBodyPayload, ApiEndpoint } from './ApiEndpoint';
import { ScheduleIdPlaceholder } from '../../placeholders/ScheduleIdPlaceholder';
import { ApiError } from '../../../ApiError';
import { KeyValueType } from '../../../commonTypes';

const SCHEDULE_ID_PLACEHOLDER = new ScheduleIdPlaceholder();

const instanceChecks = model.instanceChecks;

type ScheduleType = model.Schedule
type ScheduleIdResult = { id: number }

const schedulesApi = {

  getAll: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/schedules')
    .pureJson()
    .postProcess(buildSchedulesResult),

  createSchedule: new ApiEndpoint()
    .post()
    .acceptJson()
    .uri('/<username>/schedules')
    .pureJson()
    .payload(buildSchedulePayload)
    .postProcess(buildCreateScheduleResult),

  getScheduleAttributes: new ApiEndpoint()
    .get()
    .uri('/<username>/schedules/<id>')
    .placeholder(SCHEDULE_ID_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .postProcess(buildSchedule),

  setScheduleAttributes: new ApiEndpoint()
    .put()
    .uri('/<username>/schedules/<id>')
    .placeholder(SCHEDULE_ID_PLACEHOLDER)
    .acceptJson()
    .payload(buildUpdateSchedulePayload)
    .pureJson()
    .postProcess(extractUpdatedAttributes),

  deleteSchedule: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/schedules/<id>')
    .placeholder(SCHEDULE_ID_PLACEHOLDER)
    .pureJson()
    .postProcess(wasSuccessful),
};
export { schedulesApi };


function buildSchedulesResult(result: KeyValueType): ScheduleType[] {
  let schedules: ScheduleType[] = [];

  Object.keys(result).forEach(function (id) {
    schedules.push(model.createFromBridge('schedule', id, result[id]));
  });

  return schedules;
}

function buildSchedule(data: KeyValueType, requestParameters: KeyValueType): ScheduleType {
  const id = SCHEDULE_ID_PLACEHOLDER.getValue(requestParameters);
  return model.createFromBridge('schedule', id, data);
}

function buildSchedulePayload(parameters: KeyValueType): ApiBodyPayload {
  const schedule = parameters.schedule;

  if (!schedule) {
    throw new ApiError('Schedule to create must be provided');
  } else if (!instanceChecks.isScheduleInstance(schedule)) {
    throw new ApiError('You must provide a valid instance of a Schedule to be created');
  }

  const payload = getSchedulePayload(parameters.username, schedule);

  return {
    type: 'application/json',
    body: payload
  };
}

function buildUpdateSchedulePayload(parameters: KeyValueType): ApiBodyPayload {
  const schedule = parameters.schedule;

  if (!schedule) {
    throw new ApiError('Schedule to update must be provided');
  } else if (!instanceChecks.isScheduleInstance(schedule)) {
    throw new ApiError('You must provide a valid instance of a Schedule when updating');
  }

  const payload = getSchedulePayload(parameters.username, schedule);
  // Extract only the values we can update on a schedule
  const body: KeyValueType = {};
  ['name', 'description', 'command', 'localtime', 'status', 'autodelete'].forEach(key => {
    if (payload[key] !== null) {
      body[key] = payload[key];
    }
  });

  return {
    type: 'application/json',
    body: body
  };
}

function buildCreateScheduleResult(result: any): ScheduleIdResult {
  const hueErrors = parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating group: ${hueErrors[0].description}`, hueErrors[0]);
  }

  const id = result[0].success.id;
  return {
    id: SCHEDULE_ID_PLACEHOLDER.getValue({id: id})
  };
}

function getSchedulePayload(username: string, schedule: ScheduleType): KeyValueType {
  const payload = schedule.getHuePayload();

  if (time.isRecurring(payload.localtime)) {
    // autodelete does not apply to recurring schedules (as specified in the localtime)
    delete payload.autodelete;
  }

  // Fix the address from the action to start with "/api/{username}"
  const address = payload.command.address;
  if (!/^\/api\//.test(address)) {
    payload.command.address = `/api/${username}${address}`;
  }

  return payload;
}