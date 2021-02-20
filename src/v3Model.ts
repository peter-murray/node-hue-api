import { model, time } from '@peter-murray/hue-bridge-model';

function isTimePattern(str: string): boolean {
  return time.AbsoluteTime.matches(str)
    || time.RecurringTime.matches(str)
    || time.RandomizedTime.matches(str)
    || time.RecurringRandomizedTime.matches(str)
    || time.Timer.matches(str)
    || time.RecurringTimer.matches(str)
    || time.RandomizedTimer.matches(str)
    || time.RecurringRandomizedTimer.matches(str);
}

const timePatterns = {
  weekdays: time.WEEKDAYS,
  isRecurring: time.isRecurring,
  createAbsoluteTime,
  createRandomizedTime,
  createRecurringTime,
  createRecurringRandomizedTime,
  createTimeInterval,
  createTimer,
  createRecurringTimer,
  createRandomizedTimer,
  createRecurringRandomizedTimer,
  createFromString: time.createFromString,
  isTimePattern,
}

const actions = {
  light: (light: model.Light | string |  number) => {
    return new model.LightStateAction(light);
  },
  group: (group: model.Group | number | string) => {
    return new model.GroupStateAction(group);
  },
  sensor: (sensor: model.Sensor | number | string) => {
    return new model.SensorStateAction(sensor);
  },
  scene: (scene: model.Scene | string) => {
    return new model.SceneAction(scene);
  }
}

const ruleConditions = {
  sensor: function (sensor: model.Sensor) {
    return new model.SensorCondition(sensor);
  },

  group: function (id: model.Group | string | number) {
    return new model.GroupCondition(id);
  },
}

export const v3Model = {
  lightStates: model.lightStates,
  timePatterns,

  createEntertainment,
  createLightGroup,
  createRoom,
  createZone,

  createCLIPGenericFlagSensor,
  createCLIPGenericStatusSensor,
  createCLIPHumiditySensor,
  createCLIPLightlevelSensor,
  createCLIPOpenCloseSensor,
  createCLIPPresenceSensor,
  createCLIPTemperatureSensor,
  createCLIPSwitchSensor,

  createLightScene,
  createGroupScene,

  createSchedule,

  actions,

  createRule,
  ruleConditions,
//   ruleConditionOperators,
//
  createResourceLink,
//
//   createFromBridge,
//   createFromJson,
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Groups

function createEntertainment() {
  return new model.Entertainment();
}

function createLightGroup() {
  return new model.LightGroup();
}

function createRoom() {
  return new model.Room();
}

function createZone() {
  return new model.Zone();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sensors

function createCLIPGenericFlagSensor() {
  return new model.CLIPGenericFlag();
}

function createCLIPGenericStatusSensor() {
  return new model.CLIPGenericStatus();
}

function createCLIPHumiditySensor() {
  return new model.CLIPHumidity();
}

function createCLIPLightlevelSensor() {
  return new model.CLIPLightlevel();
}

function createCLIPOpenCloseSensor() {
  return new model.CLIPOpenClose();
}

function createCLIPPresenceSensor() {
  return new model.CLIPPresence();
}

function createCLIPTemperatureSensor() {
  return new model.CLIPTemperature();
}

function createCLIPSwitchSensor (){
  return new model.CLIPSwitch();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Scenes

function createLightScene () {
  return new model.LightScene();
}

function createGroupScene() {
  return new model.GroupScene();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Schedules

function createSchedule () {
  return new model.Schedule();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Rules

function createRule() {
  return new model.Rule();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ResourceLinks

function createResourceLink () {
  return new model.ResourceLink();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Schedule Times

function createAbsoluteTime(value: string | Date | time.AbsoluteTime) {
  return new time.AbsoluteTime(value);
}

function createRandomizedTime(value: string | Date | time.RandomizedTime) {
  return new time.RandomizedTime(value);
}

function createRecurringTime(weekdays: number, value: string | Date | time.RecurringTime) {
  return new time.RecurringTime(weekdays, value);
}

function createRecurringRandomizedTime(value: string | Date | time.RecurringRandomizedTime) {
  return new time.RecurringRandomizedTime(value);
}

function createTimeInterval(value: string | time.TimeInterval) {
  return new time.TimeInterval(value);
}

function createTimer(value: string | time.Timer) {
  return new time.Timer(value);
}

function createRecurringTimer(value: string | Date | time.RecurringTimer) {
  return new time.RecurringTimer(value);
}

function createRandomizedTimer(value: string | time.RandomizedTimer) {
  return new time.RandomizedTimer(value);
}

function createRecurringRandomizedTimer(value: string | time.RecurringRandomizedTimer) {
  return new time.RecurringRandomizedTimer(value);
}