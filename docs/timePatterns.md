# Time Patterns

The Hue Bridge supports at least 10 different time patterns used in scheduling. The `v3.model.timePatterns` module
provides the means of building these patterns in a user friendly way.

* [Supported Time Formats](#supported-time-formats)
    * [Absolute Time](#absolute-time)
    * [Randomized Time](#randomized-time)
    * [Recurring Time](#recurring-time)
    * [Recurrring Randomized Time](#recurring-randomized-time)
    * [Time Interval](#time-interval)
    * [Timer](#timer--expiring-timer)
    * [Recurring Timer](#recurring-timer)
    * [Randomized Timer](#randomized-timer)
    * [Recurring Randomized Timer](#recurring-randomized-timer)
* [model.timePatterns](#modeltimepatterns)



## Supported Time Formats
Each of the following time formats, detailed below are supported in `Schedules` for the Hue Bridge. You can either go 
hardcore and define them as `String`s as per their format, or use the various properties of the class to compose your
desired time pattern.


### Absolute Time
An absolute time is an exact date time of the format `[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss]`.

#### Creating an Absolute Time
You can create an `AbsoluteTime` instance using:

* `timePatterns.createAbsoluteTime(value)`: value is optional and is used to initialize the AbsoluteTime if specified. It can be a `String`, `Date` or another `AbsoluteTime`

When using no parameters in the instantiation call the `AbsoluteTime` will set itself to todays date with a time of `00:00:00`.

```js
// A Defaulted time using today's date and 00:00:00 for the time
const myTime = timePatterns.createAbsoluteTime();

// A time built from a date object
const timeFromDate = timePatterns.createAbsoluteTime(new Date())
  , timeFromDate_2 = timePatterns.createAbsoluteTime(new Date('4 August 1977 00:00:00 GMT')) 
;

// A string that is compatible with the absolute time format
const timeFromString = timePatterns.createAbsoluteTime('2019-11-01T12:30:00')
```

The `AbsoluteTime` object has the following functions available to configure it:

* `year(value)`: Will set the year to the specified value, requires a 4 digit year, e.g. 2019
* `month(value)`: Will set the month to the specified value in digits, 1 based, so `1` is Janurary, `2` February and so on
* `day(value)`: Will set the day of the month to the specified value in digits, 1 to 31
* `hours(value)`: Will set the hours of the day, 0 to 23
* `minutes(value)`: Will set the minutes, 0 to 59
* `seconds(value)`: Will set the seconds, 0 to 59
* `toString()`: Will generate the AbsoluteTime in the bridge format of `[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss]`

All the above setters will return the `AbsoluteTime` instance so that you can chain function calls.

```js
// Create an AbsoluteTime using fluent function
const myTime = timePatterns.createAbsoluteTime().year(2019).month(11).day(24);

console.log(myTime.toString()); // Outputs 2019-11-24T00:00:00
```



### Randomized Time
A randomized time is an absolute time with a specification of an element of randomness appended to the end of it. It 
is of the form `[YYYY]:[MM]:[DD]T[hh]:[mm]:[ss]A[hh]:[mm]:[ss]`.

The amount of randomness is controlled by the settings of the hours/minutes/seconds of the random value. A maximum of 
23 hours is all the that Hue Bridge will allow.

For example you may want to trigger a schedule at midday 12:00:00, but have it do so randomly by 30 minutes around that 
time, to give the appearance of a human being at home when you are not.


#### Creating a Randomized Time
You can create a `RandomizedTime` instance using:

* `timePatterns.createRandomizedTime(value)`: value is optional and is used to configure the date/time component

When specifying no parameters in the instantiation call the `RandomizedTime` will set itself to todays date with a time 
of `00:00:00` and effectively no randomness (zero seconds, minutes and hours).


```js
// A defaulted randomized time, today's date and T00:00:00A00:00:00 values
const myRandomTime = timePatterns.createRandomizedTime();

// A randomized time built from a date object
const randomTimeFromDate = timePatterns.createRandomizedTime(new Date())
    , randomTimeFromDate_2 = timePatterns.createRandomizedTime(new Date('12 December 2019 23:00:00 GMT'))
;

// A string that is compatible with the randomized time format (10 minutes of random)
const timeFromString = timePatterns.createAbsoluteTime('2019-11-01T12:30:00A00:10:00')
```

The `RandomizedTime` object has the following functions available to configure it:

* `year(value)`: Will set the year to the specified value, requires a 4 digit year, e.g. 2019
* `month(value)`: Will set the month to the specified value in digits, 1 based, so `1` is Janurary, `2` February and so on
* `day(value)`: Will set the day of the month to the specified value in digits, 1 to 31
* `hours(value)`: Will set the hours of the day, 0 to 23
* `minutes(value)`: Will set the minutes, 0 to 59
* `seconds(value)`: Will set the seconds, 0 to 59
* `randomHours(value)`: Will set the random hours of the day, 0 to 23
* `randomMinutes(value)`: Will set the random minutes, 0 to 59
* `randomSeconds(value)`: Will set the random seconds, 0 to 59
* `toString()`: Will generate the RandomizedTime in the bridge format of `[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss]A[hh]:[mm]:[ss]`

All the above setters will return the `RandomizedTime` instance so that you can chain function calls.

```js
const time = timePatterns.createRandomizedTime();

time.year(1977).month(12).day(1)
  .hours(23).minutes(12).seconds(31)
  .randomHours(1).randomMinutes(1).randomSeconds(10)
;

console.log(time.toString()); // Will print "1977-12-01T23:12:31A01:01:10"
```



### Recurring Time
A recurring time is a special time that allows you to specify a time of day and which days of the week to match. 
It is used to define schedules that would start at the same time of each day that it is configured for.

It has the form of `W[bbb]/T[hh]:[mm]:[ss]`, where the `bbb` value is a bitmask of the days of the week. 
These are defined in the `model.timePatterns.weekdays` Object.


#### Creating a RecurringTime
You can create a `RecurringTime` instance using:

* `timePatterns.createRecurringTime()`
    * `()`: no parameters the `RecurringTime` will be defaulted to `ALL` weekdays at a time of `00:00:00`
    * `(int)`: a weekdays `integer` parameter, the `RecurringTime` will be set to the weekdays as specified at a time of '00:00:00'
    * `(date)`: a Date parameter, the `RecurringTime` will be set to `ALL` weekdays at the time component of the date passed in
    * `(string)`: a string parameter will be parsed from the `W[bbb]/T[hh]:[mm]:[ss]`, errors with `ApiError` if not valid
    * `(weekdays, date)`: A `RecurringTime` set to the weekdays integer and at a time specified by the date


```js
const weekdays = require('node-hue-api').v3.timePatterns.weekdays;

// A defaulted recurring time, 00:00:00 for all days of the week
const myRecurringTime = timePatterns.createRecurringTime();

// A RecurringTime for Monday and Tuesday at 00:00:00
const recurringTimeFromWeekday = timePatterns.createRecurringTime(weekdays.MONDAY | weekdays.TUESDAY);

// A RecurringTime for ALL weekdays at the time component of the provided date (using UTC).
const recurringTimeFromDate = timePatterns.createRecurringTime(new Date(Date.now()))
  // time component of 12:31:30
  , recurringTimeFromDate = timePatterns.createRecurringTime(new Date('12 December 2019 12:31:30 UTC'))
;

// A string that is compatible with the randomized time format, All weekdays at 12:30:00
const timeFromString = timePatterns.createAbsoluteTime('W127/T12:30:00');

// A RecurringTime set by weekdays and date (Sunday at 13:01:59)
const timeFromWeekdaysAndDate = timePatterns.createRecurringTime(weekdays.SUNDAY, new Date('2019-12-01T13:01:59'));
```

The `RecurringTime` object has the following functions available to configure it:

* `hours(value)`: Will set the hours of the day, 0 to 23
* `minutes(value)`: Will set the minutes, 0 to 59
* `seconds(value)`: Will set the seconds, 0 to 59
* `weekdays(value)`: Will set the weekdays to the specified value
* `toString()`: Will generate the RecurringTime in the bridge format of `W[bbb]/T[hh]:[mm]:[ss]`

All the above setters will return the `RecurringTime` instance so that you can chain function calls.

To access the weekday values that you can used to define the days of the week to trigger on, use the constants from
`timePatterns.weekdays`, which has the following keys:

* `MONDAY`
* `TUESDAY`
* `WEDNESDAY`
* `THURSDAY`
* `FRIDAY`
* `SATURDAY`
* `SUNDAY`
* `WEEKDAY`: Monday, Tuesday, Wednesday, Thursday and Friday
* `WEEKEND`: Saturday and Sunday
* `ALL`: All of the days

```js
const time = timePatterns.createRecurringTime();

time.hours(23).minutes(12).seconds(31).weekdays(timePatterns.weekdays.MONDAY);

console.log(time.toString()); // Will print "W064/T23:12:31"
```




### Recurring Randomized Time
This is a [`RecurringTime`](#recurring-time), that has an random element append to the end of it. It takes the form of
`W[bbb]/T[hh]:[mm]:[ss]A[hh]:[mm]:[ss]`.

The amount of randomness is controlled by the settings of the hours/minutes/seconds of the random value. A maximum of 
23 hours is all the that Hue Bridge will allow. 


#### Creating a Recurring Randomized Time
You can create a `RandomizedRecurringTime` instance using:

* `timePatterns.createRandomizedRecurringTime()`
    * `()`: no parameters the `RecurringTime` will be defaulted to `ALL` weekdays at a time of `00:00:00`
    * `(int)`: a weekdays `integer` parameter, the `RecurringTime` will be set to the weekdays as specified at a time of '00:00:00'
    * `(date)`: a Date parameter, the `RecurringTime` will be set to `ALL` weekdays at the time component of the date passed in
    * `(string)`: a string parameter will be parsed from the `W[bbb]/T[hh]:[mm]:[ss]A[hh]:[mm]:[ss]`, errors with `ApiError` if not valid
    * `(weekdays, date)`: A `RecurringTime` set to the weekdays integer and at a time specified by the date

The random aspect of the time is not currently able to be set from the constructor (unless you use the string format)

```js
const weekdays = require('node-hue-api').v3.timePatterns.weekdays;

// A defaulted recurring time, 00:00:00 for all days of the week and no randomness
const myRecurringTime = timePatterns.createRecurringTime();

// A RecurringTime for Monday and Tuesday at 00:00:00 and no randomness
const recurringTimeFromWeekday = timePatterns.createRecurringTime(weekdays.MONDAY | weekdays.TUESDAY);

// A RecurringTime for ALL weekdays at the time component of the provided date (using UTC) and no randomness
const recurringTimeFromDate = timePatterns.createRecurringTime(new Date(Date.now()))
  // all the days of the week and a time component of 12:31:30 with no randomness
  , recurringTimeFromDate = timePatterns.createRecurringTime(new Date('12 December 2019 12:31:30 UTC'))
;

// A string that is compatible with the randomized time format, All weekdays at 12:30:00 with a randomness of 30 seconds
const timeFromString = timePatterns.createAbsoluteTime('W127/T12:30:00A00:00:30');

// A RecurringTime set by weekdays and date (Sunday at 13:01:59)
const timeFromWeekdaysAndDate = timePatterns.createRecurringTime(weekdays.SUNDAY, new Date('2019-12-01T13:01:59'));
```

The documentation for the [RecurringTime](#recurring-time) is applicable for understanding the majority of the 
properties/functions you can interact with, along with the addition of the following:

* `randomHours(value)`: Will set the random hours of the day, 0 to 23
* `randomMinutes(value)`: Will set the random minutes, 0 to 59
* `randomSeconds(value)`: Will set the random seconds, 0 to 59
* `toString()`: Will generate the RandomizedRecurringTime in the bridge format of `W[bbb]/T[hh]:[mm]:[ss]A[hh]:[mm]:[ss]`


```js
const time = timePatterns.createRecurringRandomizedTime();

// Monday at 23:12:31 with a randomness of 10 minutes
time.hours(23).minutes(12).seconds(31)
  .weekdays(timePatterns.weekdays.MONDAY)
  .randomMinutes(10)
;

console.log(time.toString()); // Will print "W064/T23:12:31A00:10:00"
```



### Time Interval
Creates an interval of time, up to a maximum of 23 hours that occurs on one or more weekdays.

It has the form of `W[bbb]/T[hh]:[mm]:[ss]/T[hh]:[mm]:[ss]`, where the `bbb` value is a bitmask of the days of the week. 
These are defined in the `model.timePatterns.weekdays` Object.


#### Creating a Time Interval
You can create a `TimeInterval` instance using:

* `timePatterns.createTimeInterval()`
    * `()`: no parameters the `TimeInterval` will be defaulted to `ALL` weekdays with a `from` time of `00:00:00` and a `to` time of '00:00:00'
    * `(string)`: a string parameter will be parsed from the `W[bbb]/T[hh]:[mm]:[ss]/T[hh]:[mm]:[ss]`, errors with `ApiError` if not valid


```js
// A defaulted time interval, ALL weekdays with a from and to time of 00:00:00
const myRandomTime = timePatterns.createTimeInterval();

// A string that is compatible with the time interval format (ALL weekdays from 12:30:00 to 12:40:00)
const timeFromString = timePatterns.createTimeInterval('W127/T12:30:00/T12:40:00')
```


The `TimeInterval` object has the following functions available to configure it:

* `from(date)`: Will set the hours, minutes and seconds from the UTC values of the provided `date` for the `from` time
* `fromHours(value)`: Will set the hours of the day, 0 to 23 for the `from` time
* `fromMinutes(value)`: Will set the minutes, 0 to 59 for the `from` time
* `fromSeconds(value)`: Will set the seconds, 0 to 59 for the `from` time
* `to(date)`: Will set the hours, minutes and seconds from the UTC values of the provided `date` for the `to` time
* `toHours(value)`: Will set the hours of the day, 0 to 23 for the `to` time
* `toMinutes(value)`: Will set the minutes, 0 to 59 the `to` time
* `toSeconds(value)`: Will set the seconds, 0 to 59 the `to` time
* `weekdays(value)`: Will set the weekdays to the specified value
* `toString()`: Will generate the TimeInterval in the bridge format of `W[bbb]/T[hh]:[mm]:[ss]/T[hh]:[mm]:[ss]`


```js
const time = timePatterns.createTimeInterval();

// Monday from 23:12:00 to 23:59:59
time.weekdays(timePatterns.weekdays.MONDAY)
  .fromHours(23).fromMinutes(12)
  .toHours(23).toMinutes(12).toSeconds(59)
;

console.log(time.toString()); // Will print "W064/T23:12:00/T23:59:59"
```


### Timer / Expiring Timer
A timer that will expire in a specified time frame.

It has the form of `PT[hh]:[mm]:[ss]` and will trigger once the specified time period is up.
For example `PT01:00:00` would trigger in one hour.

#### Creating a Timer
You can create an `Timer` instance using:

* `timePatterns.createTimer(value)`: `value` is optional but can be a String in format of `PT[hh]:[mm]:[ss]` or another `Timer` instance

```js
// A Defaulted Timer "PT00:00:00"
const timer = timePatterns.createTimer();

// A Timer for 1 hour
const timerFromString = timePatterns.createTimer('PT01:00:00');
```

The `Timer` can be configured using the following functions:

* `hours(value)`: Sets the number of hours before the timer triggers, 0 to 23 
* `minutes(value)`: Sets the number of minutes before the timer triggers, 0 to 59
* `seconds(value)`: Sets the number of seconds before the timer triggers, 0 to 59
* `toString()`: Will generate the Timer in for the bridge for of `PT[hh]:[mm]:[ss]`

All the above setters will return the `Timer` instance so that you can chain function calls.

```js
// Create a timer that will trigger in 60 seconds / 1 minute (PT00:01:00)
const minuteTimer = timePatterns.createTimer().minutes(1);

// Create a timer that will trigger in 1 hour (PT01:00:00)
const hourTimer = timePatterns.createTimer().hours(1);


// Create a timer that will trigger in 1 hour 20 minutes and 30 seconds
const timer = timePatterns.createTimer().hours(1).minutes(20).seconds(30);
```


### Recurring Timer
A RecurringTimer is a timer that will reoccur either a number of times, or continuously, it has the form of 
`R[nn]/PT[hh]:[mm]:[ss]` reoccurring `[nn]` times or `R/PT[hh]:[mm]:[ss]`, reoccurring continuously.


#### Creating a Recurring Timer
You can create an `RecurringTimer` instance using:

* `timePatterns.createRecurringTimer(value)`: `value` is optional but can be a String in format of `PT[hh]:[mm]:[ss]` or another `Timer` instance

```js
// A timer that is defaulted to R/PT00:00:00
const recurringTimer = timepatterns.createRecurringTimer();

// A timer that will repeat every 10 minutes R/PT00:10:00 indefinitely
const timerFromString = timepatterns.createRecurringTimer('R/PT00:10:00')
```


The `RecurringTimer` can be configured using the following functions:

 * `hours(value)`: Sets the number of hours before the timer triggers, 0 to 23 
 * `minutes(value)`: Sets the number of minutes before the timer triggers, 0 to 59
 * `seconds(value)`: Sets the number of seconds before the timer triggers, 0 to 59
 * `reoccurs(value)`: Will reoccur for exactly `value` times, 0 to 99, 0 meaning it will continue to repeat forever.
 * `toString()`: Will generate the Timer in for the bridge for of `PT[hh]:[mm]:[ss]`
 
All the above setters will return the `Timer` instance so that you can chain function calls.

```js
// Create a RecurringTimer that will trigger every 60 seconds / 1 minute (R/PT00:01:00)
const minuteTimer = timePatterns.createRecurringTimer().minutes(1);

// Create a timer that will trigger in 1 hour (R03/PT01:00:00) for three times then stop
const hourTimer = timePatterns.createTimer().hours(1).reoccurs(3);


// Create a RecurringTimer that will trigger every 1 hour 20 minutes and 30 seconds 99 times and then stop
const timer = timePatterns.createTimer().hours(1).minutes(20).seconds(30).reoccurs(99);
```



### Randomized Timer
A `RandomizedTimer` is a `Timer` with a random element as to when it will trigger.

It has the form of `PT[hh]:[mm]:[ss]A[hh]:[mm]:[ss]` and will trigger once around the time specified within the random timeframe.
For example `PT01:00:00A00:00:30` would trigger in one hour wityh 30 seconds of randomness.

#### Creating a RandomizedTimer
You can create an `RandomizedTimer` instance using:

* `timePatterns.createRandomizedTimer(value)`: `value` is optional but can be a String in format of `PT[hh]:[mm]:[ss]A[hh]:[mm]:[ss]`
    or another `RandomizedTimer` instance

```js
// A Defaulted Timer "PT00:00:00A00:00:00"
const timer = timePatterns.createRandomizedTimer();

// A Timer for 1 hour with 10 minutes of randomness
const timerFromString = timePatterns.createRandomizedTimer('PT01:00:00A00:10:00');
```

The `RandomizedTimer` can be configured using the following functions:

* `hours(value)`: Sets the number of hours before the timer triggers, 0 to 23 
* `minutes(value)`: Sets the number of minutes before the timer triggers, 0 to 59
* `seconds(value)`: Sets the number of seconds before the timer triggers, 0 to 59
* `randomHours(value)`: Will set the random hours of the day, 0 to 23
* `randomMinutes(value)`: Will set the random minutes, 0 to 59
* `randomSeconds(value)`: Will set the random seconds, 0 to 59
* `toString()`: Will generate the Timer in for the bridge for of `PT[hh]:[mm]:[ss]A[hh]:[mm]:[ss]`

All the above setters will return the `Timer` instance so that you can chain function calls.

```js
// Create a timer that will trigger in 60 seconds / 1 minute with 5 seconds of randomness (PT00:01:00A00:00:05)
const minuteTimer = timePatterns.createRandomizedTimer().minutes(1).randomSeconds(5);

// Create a timer that will trigger in 1 hour with randomness of 2 minutes (PT01:00:00A00:02:00)
const hourTimer = timePatterns.createRandomizedTimer().hours(1).randomMinutes(2);


// Create a timer that will trigger in 1 hour 20 minutes and 30 seconds with 30 minutes and 10 seconds of randomness
const timer = timePatterns.createRandomizedTimer().hours(1).minutes(20).seconds(30).randomMinutes(30).randomSeconds(10);
```




#### Recurring Randomized Timer
A `RecurringRandomizedTimer` is a `Timer` that will trigger at the specified time (allowing for an element of randomness)
for a number of times (or forever, depneding upon the reoccurrance setting).

It has the form of `R/PT[hh]:[mm]:[ss]A[hh]:[mm]:[ss]` for timers that have no limit on the number of times it reoccurs or
`R[nn]/PT[hh]:[mm]:[ss]A[hh]:[mm]:[ss]` where `[nn]` is the number of times it will reoccur before expiring. 


### Creating a RecurringRandomizedTimer
You can create an `RecurringRandomizedTimer` instance using:

* `timePatterns.createRecurringRandomizedTimer(value)`: `value` is optional but can be a String in format of `R[nn]/PT[hh]:[mm]:[ss]A[hh]:[mm]:[ss]`
    or `R/PT[hh]:[mm]:[ss]A[hh]:[mm]:[ss]` or another `RecurringRandomizedTimer` instance

```js
// A Defaulted Timer "R/PT00:00:00A00:00:00"
const timer = timePatterns.createRecurringRandomizedTimer();

// A Timer for 1 hour with 10 minutes of randomness
const timerFromString = timePatterns.createRecurringRandomizedTimer('R/PT01:00:00A00:10:00');
```

The `RecurringRandomizedTimer` can be configured using the following functions:

* `hours(value)`: Sets the number of hours before the timer triggers, 0 to 23 
* `minutes(value)`: Sets the number of minutes before the timer triggers, 0 to 59
* `seconds(value)`: Sets the number of seconds before the timer triggers, 0 to 59
* `randomHours(value)`: Will set the random hours of the day, 0 to 23
* `randomMinutes(value)`: Will set the random minutes, 0 to 59
* `randomSeconds(value)`: Will set the random seconds, 0 to 59
* `reoccurs(value)`: Will reoccur for exactly `value` times, 0 to 99, 0 meaning it will continue to repeat forever.
* `toString()`: Will generate the Timer in for the bridge for of `PT[hh]:[mm]:[ss]A[hh]:[mm]:[ss]`

All the above setters will return the `Timer` instance so that you can chain function calls.

```js
// Create a timer that will trigger in 60 seconds / 1 minute with 5 seconds of randomness (PT00:01:00A00:00:05)
const minuteTimer = timePatterns.createTimer().minutes(1).randomSeconds(5);

// Create a timer that will trigger in 1 hour with randomness of 2 minutes (PT01:00:00A00:02:00)
const hourTimer = timePatterns.createTimer().hours(1).randomMinutes(2);


// Create a timer that will trigger in 1 hour 20 minutes and 30 seconds with 30 minutes and 10 seconds of randomness
const timer = timePatterns.createTimer().hours(1).minutes(20).seconds(30).randomMinutes(30).randomSeconds(10);
```



## model.timePatterns

### weekdays
This provides access to the definitions of the bitmask values the weekdays property of a `RecurringTime` or 
`RandomizedRecurringTime`.

* `MONDAY`
* `TUESDAY`
* `WEDNESDAY`
* `THURSDAY`
* `FRIDAY`
* `SATURDAY`
* `SUNDAY`
* `WEEKDAY`: Monday, Tuesday, Wednesday, Thursday and Friday
* `WEEKEND`: Saturday and Sunday
* `ALL`: All of the days

When setting the weekdays, you will have to bitwise or them using `|`.

For example to create a bitmask for Monday, Wednesday and Friday you would use the following:

```js
const weekdays = require('node-hue-api').v3.model.timePatterns.weekdays;

// Creating a bitmask for Monday, Wednesday and Friday only
const myWeekdayBitmask = weekdays.MONDAY | weekdays.WEDNESDAY | weekdays.FRIDAY;
```



### isRecurring()

### isTimePattern()

### createAbsoluteTime()

### createRandomizedTime()

### createRecurringTime()

### createRecurringRandomizedTime()

### createTimeInterval()

### createTimer()


