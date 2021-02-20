import { model } from '@peter-murray/hue-bridge-model';
import { ApiDefinition } from './http/ApiDefinition';
import { schedulesApi } from './http/endpoints/schedules';
import { Api } from './Api';

type Schedule = model.Schedule
type ScheduleId = number | string | Schedule

export class Schedules extends ApiDefinition {

  constructor(hueApi: Api) {
    super(hueApi);
  }

  getAll(): Promise<Schedule[]> {
    return this.execute(schedulesApi.getAll);
  }

  // /**
  //  * @deprecated Use getSchedule(id) instead
  //  * @param id {int | Schedule}
  //  * @returns {Promise<Schedule>}
  //  */
  // get(id) {
  //   util.deprecatedFunction('5.x', 'schedules.get(id)', 'Use schedules.getSchedule(id) instead.');
  //   return this.getSchedule(id);
  // }

  getSchedule(id: ScheduleId): Promise<Schedule> {
    return this.execute(schedulesApi.getScheduleAttributes, {id: id});
  }

  getScheduleByName(name: string): Promise<Schedule[]> {
    return this.getAll()
      .then(schedules => {
        return schedules.filter(schedule => schedule.name === name);
      });
  }

  createSchedule(schedule: Schedule): Promise<Schedule> {
    const self = this;

    return self.execute(schedulesApi.createSchedule, {schedule: schedule})
      .then(result => {
        return self.getSchedule(result.id);
      });
  }

  updateSchedule(schedule: Schedule): Promise<boolean> {
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

  deleteSchedule(id: ScheduleId): Promise<boolean> {
    return this.execute(schedulesApi.deleteSchedule, {id: id});
  }
};