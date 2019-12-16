'use strict';

const schedulesApi = require('./http/endpoints/schedules')
  , ApiDefinition = require('./http/ApiDefinition')
  , util = require('../util')
;

/**
 * @typedef {import('../model/Schedule')} Schedule
 *
 * @type {Schedules}
 */
module.exports = class Schedules extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  /**
   * Gets all the Schedules from the bridge.
   * @returns {Promise<Array<Schedule>>} A Promise that will resolve to an Array of Schedules.
   */
  getAll() {
    return this.execute(schedulesApi.getAll);
  }

  /**
   * @deprecated Use getSchedule(id) instead
   * @param id {int | Schedule}
   * @returns {Promise<Schedule>}
   */
  get(id) {
    util.deprecatedFunction('5.x', 'schedules.get(id)', 'Use schedules.getSchedule(id) instead.');
    return this.getSchedule(id);
  }

  /**
   * Gets a specific Schedule from the Bridge.
   * @param id {int | Schedule} The id or Schedule instance to retrieve from the bridge.
   * @returns {Promise<Schedule>} A Promise that will resolve to the actual schedule instance.
   */
  getSchedule(id) {
    return this.execute(schedulesApi.getScheduleAttributes, {id: id});
  }

  /**
   *
   * @param name
   * @returns {Promise<Schedule[]>}
   */
  getScheduleByName(name) {
    return this.getAll()
      .then(schedules => {
        return schedules.filter(schedule => schedule.name === name);
      });
  }

  /**
   * Creates a new Schedule on the bridge.
   * @param schedule {Schedule} The instance to create on the bridge.
   * @returns {PromiseLike<Schedule> | Promise<Schedule>} The resultant Schedule instance that was created.
   */
  createSchedule(schedule) {
    const self = this;

    return self.execute(schedulesApi.createSchedule, {schedule: schedule})
      .then(result => {
        return self.getSchedule(result.id);
      });
  }

  /**
   * Updates a Schedule.
   * @param schedule {Schedule}  The schedule with updated attributes to be saved to the Bridge.
   * @returns {Promise<Object>} A promise that will resolve to an Object of the keys that were the attrubutes updated
   * and a Boolean value that indicates if it was updated.
   */
  updateSchedule(schedule) {
    return this.execute(schedulesApi.setScheduleAttributes, {id: schedule, schedule: schedule});
  }

  // /**
  //  * @deprecated Use udpateSchedule(schedule) instead.
  //  * @param id
  //  * @param schedule
  //  * @returns {Promise<boolean>}
  //  */
  // update(id, schedule) {
  //   return this.execute(schedulesApi.setScheduleAttributes, {id: id, schedule: schedule});
  // }

  /**
   * Deletes an existing Schedule.
   * @param id {int | Schedule} The id or Schedule instance to delete.
   * @returns {Promise<boolean>} A Promise that will resolve to a boolean indicating success.
   */
  deleteSchedule(id) {
    return this.execute(schedulesApi.deleteSchedule, {id: id});
  }
};