'use strict';

const schedulesApi = require('./http/endpoints/schedules')
  , ApiDefinition = require('./http/ApiDefinition')
;

module.exports = class Schedules extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return this.execute(schedulesApi.getAll);
  }

  createSchedule(schedule) {
    //TODO convert to schedule if possible here
    return this.execute(schedulesApi.createSchedule, {schedule: schedule});
  }

  get(id) {
    return this.execute(schedulesApi.getScheduleAttributes, {id: id});
  }

  update(id, schedule) {
    //TODO convert to schedule if possible here
    return this.execute(schedulesApi.setScheduleAttributes, {id: id, schedule: schedule});
  }

  deleteSchedule(id) {
    return this.execute(schedulesApi.deleteSchedule, {id: id});
  }
};