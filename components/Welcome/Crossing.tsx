'use client';

import { Text, Stack, RingProgress, Center, useMantineTheme } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { Bar, Circle } from '@visx/shape';

type Car = {
  speed: number;
  position: number;
  type: string;
  color: number;
  timeStopped?: number;
};

const STARTING_POSITION = -400;
const TICK_LENGTH = 5;
const DAKOTA_CO2_IN_KG = 1.8;

function getRandomInt(around: number) {
  return Math.floor(around + Math.random() * 10 - 5);
}

function c02PerMs(t: number) {
  return (((t / 1000) * 0.588) / 1000);
}

export function Crossing({
  safetyTime = 1,
  distance = 20,
  speedLimit = 50,
  maxCars = 60,
  width = 1000,
}) {
  const theme = useMantineTheme();
  const [cars, setCars] = useState<Car[]>([]);
  const [redlight, setRedlight] = useState<'init' | 'red' | 'green'>('init');
  const [timeStopped, setTimeStopped] = useState<number>(0);

  const usableWidth = Math.min(width, 1000);

  function hasToSlowDown(car: Car, otherCar: Car) {
    const result =
      car.position + (((safetyTime * car.speed) / 3.6) * TICK_LENGTH) / 1000 >
      otherCar.position - 10;
    // if (result) console.log(car, otherCar, result);
    return result;
  }

  function moveCars(carsToMove: Car[]) {
    if (carsToMove.length === 0) {
      return [
        {
          speed: getRandomInt(speedLimit),
          position: STARTING_POSITION,
          type: 'car',
          color: Math.random(),
        },
      ];
    }

    let carsToReturn = carsToMove.filter((car) => car.position < 3000);

    if (
      carsToReturn.length < maxCars &&
      carsToReturn[carsToReturn.length - 1].position > STARTING_POSITION + distance
    ) {
      carsToReturn = [
        ...carsToReturn,
        {
          speed: getRandomInt(speedLimit),
          position: STARTING_POSITION,
          type: 'car',
          color: Math.random(),
        },
      ];
    }

    carsToReturn = carsToReturn.map((car, index) => {
      if (index === 0) {
        if (car.type === 'car' && car.speed < speedLimit - 5) {
          return {
            ...car,
            speed: Math.min(
              getRandomInt(speedLimit),
              car.speed + ((160 / 3.6) * TICK_LENGTH) / 1000
            ),
          };
        }
      }

      if (car.type === 'redlight') {
        return {
          ...car,
          speed: 0,
        };
      }

      const previousCars = carsToReturn.slice(0, index);

      if (previousCars.find((previousCar) => hasToSlowDown(car, previousCar))) {
        return {
          ...car,
          speed: Math.max(
            0,
            car.speed - ((Math.max(2, car.speed * 10) / 3.6) * TICK_LENGTH) / 1000
          ),
        };
      }

      if (carsToReturn[index - 1] && car.speed < carsToReturn[index - 1].speed) {
        return {
          ...car,
          speed: Math.min(getRandomInt(speedLimit), car.speed + ((160 / 3.6) * TICK_LENGTH) / 1000),
        };
      }

      return car;
    });

    carsToReturn = carsToReturn.map((car) => ({
      ...car,
      timeStopped:
        car.type === 'car' && car.speed === 0
          ? (car.timeStopped ?? 0) + TICK_LENGTH
          : car.timeStopped,
    }));

    return carsToReturn.map((car) => ({
      ...car,
      position: car.position + ((car.speed / 3.6) * TICK_LENGTH) / 1000,
    }));
  }

  useEffect(() => {
    if (
      cars[0] !== undefined &&
      redlight === 'init' &&
      cars[0].position > -30 &&
      cars[0].position < -10
    ) {
      setRedlight('red');
      setTimeout(() => {
        setRedlight('green');
      }, 60000);
    }

    setTimeStopped(
      cars.reduce((ts: number, car: Car) => {
        if (car.timeStopped) {
          return ts + car.timeStopped;
        }

        return ts;
      }, 0)
    );
  }, [cars]);

  const xScale = useMemo(
    () => scaleLinear<number>().domain([-400, 0]).range([0, usableWidth]),
    [usableWidth]
  );

  const colorScale = useMemo(
    () => scaleLinear<string>().domain([0, 1]).range([theme.colors.red[5], theme.colors.green[5]]),
    []
  );

  const carWidth = useMemo(() => xScale(3) - xScale(0), [xScale]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCars(moveCars);
    }, TICK_LENGTH);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (redlight === 'red') {
      setCars((prev: Car[]) => [{ speed: 0, position: 0, type: 'redlight', color: 0 }, ...prev]);
    } else {
      setCars((prev: Car[]) => prev.filter((car) => car.type !== 'redlight'));
    }
  }, [redlight]);

  return (
    <>
      <Stack>
        <svg width={usableWidth} height={30}>
          <rect y={20} width={usableWidth} height={10} fill={theme.colors.gray[1]} />
          {cars
            .filter((car) => car.type === 'car')
            .map((car, index) => (
              <Group key={index} top={22} left={xScale(car.position)}>
                <Bar width={carWidth} height={5} fill={colorScale(car.speed / speedLimit)} />
              </Group>
            ))}
          <Circle
            cx={xScale(0) - 5}
            cy={5}
            r={5}
            fill={redlight === 'red' ? theme.colors.red[5] : theme.colors.green[5]}
          />
        </svg>
        <Center>
          <RingProgress
            sections={[
              {
                value: (c02PerMs(timeStopped) / DAKOTA_CO2_IN_KG) * 100,
                color: theme.colors.red[5],
              },
            ]}
            label={
              <Text
                size="xl"
                ta="center"
                fw={900}
                c={
                  c02PerMs(timeStopped) > DAKOTA_CO2_IN_KG
                  ? theme.colors.red[5]
                  : theme.colors.gray[4]
                }
              >
                {c02PerMs(timeStopped).toFixed(1)}
              </Text>
            }
          />
        </Center>
      </Stack>
    </>
  );
}
