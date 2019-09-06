'use strict';

const ApiEndpoint = require('./endpoint')
  , ScheduleIdPlaceholder = require('../placeholders/ScheduleIdPlaceholder')
  , Schedule = require('../../../bridge-model/Schedule')
  , ApiError = require('../../../ApiError')
  , utils = require('../../../../hue-api/utils')
;


module.exports = {

  getAll: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/schedules')
    .pureJson()
    .postProcess(buildSchedulesResult),

  //TODO
  createSchedule: new ApiEndpoint()
    .post()
    .acceptJson()
    .uri('/<username>/schedules')
    .pureJson()
    .payload(buildSchedulePayload)
    .postProcess(buildCreateScheduleResult),

  //TODO
  getScheduleAttributes: new ApiEndpoint()
    .get()
    .uri('/<username>/schedules/<id>')
    .placeholder(new ScheduleIdPlaceholder())
    .acceptJson()
    .pureJson()
    .postProcess(buildSchedule),

  //TODO
  setScheduleAttributes: new ApiEndpoint()
    .put()
    .uri('/<username>/schedules/<id>')
    .placeholder(new ScheduleIdPlaceholder())
    .acceptJson()
    .payload(buildScheduleAttributeBody)
    .pureJson()
    // .postProcess(utils.wasSuccessful),
    .postProcess(extractUpdatedAttributes),

  //TODO
  deleteSchedule: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/schedules/<id>')
    .placeholder(new ScheduleIdPlaceholder())
    .pureJson()
    .postProcess(validateScheduleDeletion),
};


function buildSchedulesResult(result) {
  let schedules = [];

  Object.keys(result).forEach(function (id) {
    schedules.push(new Schedule(result[id], id));
  });

  return schedules;
}

function buildSchedule(data, requestParameters) {
  if (requestParameters) {
    return new Schedule(data, requestParameters.id);
  } else {
    return new Schedule(data);
  }
}

function validateScheduleDeletion(result) {
  if (!utils.wasSuccessful(result)) {
    throw new ApiError(utils.parseErrors(result).join(', '));
  }
  return true;
}

function buildSchedulePayload(parameters) {
  const schedule = parameters.schedule;

  if (!schedule) {
    throw new ApiError('Schedule to create must be provided');
  } else if (!(schedule instanceof Schedule)) {
    throw new ApiError('You must provide a valid instance of a Schedule to be created');
  }

  return {
    type: 'application/json',
    body: schedule.payload
  };
}

function buildScheduleAttributeBody(parameters) {
  const body = {}
    , updatedSchedule = parameters ? parameters.schedule : null;

  if (updatedSchedule) {
    if (updatedSchedule instanceof Schedule) {
      Object.assign(body, updatedSchedule.payload);
    } else {
      Object.assign(body, updatedSchedule);//TODO need to convert to schedule then validate
    }
  }

  return {
    type: 'application/json',
    body: body
  };
}

function buildCreateScheduleResult(result) {
  const hueErrors = utils.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating group: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: Number(result[0].success.id)};
}

function extractUpdatedAttributes(result) {
  if (utils.wasSuccessful(result)) {
    const values = {}
    result.forEach(update => {
      const success = update.success;
      Object.keys(success).forEach(key => {
        const attribute = /.*\/(.*)$/.exec(key)[1];
        values[attribute] = true; //success[key];
      });
    });
    return values;
  } else {
    throw new ApiError('Error in response'); //TODO extract the error
  }
}